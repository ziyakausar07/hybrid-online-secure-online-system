import json
import os
import re
from pathlib import Path

root = Path(__file__).resolve().parent

# helper

def write_if_changed(path, text):
    path = Path(path)
    if path.exists():
        old = path.read_text(encoding='utf-8')
        if old == text:
            return False
    path.write_text(text, encoding='utf-8')
    return True

def remove_dependency_robust(pom_text, group_id, artifact_id, version=None, limit=None):
    pattern = r'<\s*dependency\s*>.*?</\s*dependency\s*>'
    
    def matches(block):
        if not re.search(rf'<\s*groupId\s*>\s*{re.escape(group_id)}\s*</\s*groupId\s*>', block):
            return False
        if not re.search(rf'<\s*artifactId\s*>\s*{re.escape(artifact_id)}\s*</\s*artifactId\s*>', block):
            return False
        if version:
            if not re.search(rf'<\s*version\s*>\s*{re.escape(version)}\s*</\s*version\s*>', block):
                return False
        return True

    blocks = re.findall(pattern, pom_text, flags=re.DOTALL)
    count = 0
    for b in blocks:
        if matches(b):
            pom_text = pom_text.replace(b, '', 1)
            count += 1
            if limit and count >= limit:
                break
    return pom_text

# 1. Fix backend pom.xml duplicates and invalid dependencies
pom_file = root / 'backend' / 'pom.xml'
pom = pom_file.read_text(encoding='utf-8')
orig_pom = pom

# Remove duplicate javax.servlet-api (keep one)
pom = remove_dependency_robust(pom, 'javax.servlet', 'javax.servlet-api', limit=1)
# Remove duplicate and older org.json version 20231013
pom = remove_dependency_robust(pom, 'org.json', 'json', version='20231013')
# Remove jakarta.websocket-api as we are using javax.websocket-api
pom = remove_dependency_robust(pom, 'jakarta.websocket', 'jakarta.websocket-api')
# Remove duplicate/older tyrus-server version 1.15
pom = remove_dependency_robust(pom, 'org.glassfish.tyrus', 'tyrus-server', version='1.15')

# Clean up any leftover blank lines inside dependencies block
pom = re.sub(r'\n\s*\n\s*\n', '\n\n', pom)

if pom != orig_pom:
    pom_file.write_text(pom, encoding='utf-8')
    print('Patched backend/pom.xml')

# 2. Clean package.json files
for pkg_name in ['backend-node', 'frontend']:
    pkg_path = root / pkg_name / 'package.json'
    pkg = json.loads(pkg_path.read_text(encoding='utf-8'))
    modified = False
    if pkg_name == 'backend-node':
        deps = pkg.get('dependencies', {})
        if 'backend-node' in deps:
            del deps['backend-node']
            modified = True
    if pkg_name == 'frontend':
        deps = pkg.get('dependencies', {})
        for bad in ['frontend', 'express']:
            if bad in deps:
                del deps[bad]
                modified = True
    if modified:
        pkg_path.write_text(json.dumps(pkg, indent=2) + '\n', encoding='utf-8')
        print(f'Cleaned {pkg_path}')

# 3. Create frontend/src/apiConfig.js
api_config_path = root / 'frontend' / 'src' / 'apiConfig.js'
api_config_text = '''const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:7070/backend/liveResults";

export { API_BASE_URL, WS_URL };
'''
if write_if_changed(api_config_path, api_config_text):
    print('Created frontend/src/apiConfig.js')

# 4. Replace hardcoded frontend URLs
frontend_src = root / 'frontend' / 'src'
for path in frontend_src.rglob('*.js'):
    if path.name == 'apiConfig.js':
        continue
    content = path.read_text(encoding='utf-8')
    orig = content
    if 'REACT_APP_API_BASE_URL' in content or 'WS_URL' in content:
        pass
    content = re.sub(r'"http://localhost:5000/api([^"\n]*)"', r'`${API_BASE_URL}/api\1`', content)
    content = re.sub(r'"http://localhost:5000([^"\n]*)"', r'`${API_BASE_URL}\1`', content)
    content = re.sub(r'"ws://localhost:7070/backend/liveResults"', r'WS_URL', content)
    content = re.sub(r'io\("http://localhost:5000"\)', r'io(API_BASE_URL)', content)
    content = re.sub(r'new WebSocket\("ws://localhost:7070/backend/liveResults"\)', r'new WebSocket(WS_URL)', content)
    if content != orig:
        if 'from "../apiConfig"' not in content and "from '../apiConfig'" not in content and path.suffix == '.js':
            import_line = 'import { API_BASE_URL, WS_URL } from "../apiConfig";\n'
            parts = content.split('\n')
            insert_at = 0
            for i, line in enumerate(parts):
                if line.startswith('import '):
                    insert_at = i + 1
            parts.insert(insert_at, import_line)
            content = '\n'.join(parts)
        path.write_text(content, encoding='utf-8')
        print(f'Patched frontend file: {path.relative_to(root)}')

# 5. Patch backend-node route URLs
backend_node_root = root / 'backend-node'
for dirpath, dirnames, filenames in os.walk(backend_node_root):
    if 'node_modules' in dirnames:
        dirnames.remove('node_modules')
    for filename in filenames:
        if filename.endswith('.js'):
            path = Path(dirpath) / filename
            content = path.read_text(encoding='utf-8')
            orig = content
            
            # Special handling for myVotes.js to avoid breaking servlet endpoint
            if path.name == 'myVotes.js':
                content = content.replace(
                    'const JAVA_BACKEND_URL = "http://localhost:7070/backend/MyVotesServlet";',
                    'const { JAVA_BACKEND_URL } = require("../config");'
                )
                content = re.sub(
                    r'axios\.get\(\s*JAVA_BACKEND_URL\s*([,)])',
                    r'axios.get(`${JAVA_BACKEND_URL}/MyVotesServlet`\1',
                    content
                )
            
            # General URL replacement
            content = re.sub(r'"http://localhost:7070/backend/([^"\n]*)"', r'`${JAVA_BACKEND_URL}/\1`', content)
            content = re.sub(r'`http://localhost:7070/backend/([^`\n]*)`', r'`${JAVA_BACKEND_URL}/\1`', content)
            
            # Ensure JAVA_BACKEND_URL is imported from config if referenced
            if 'JAVA_BACKEND_URL' in content:
                config_match = re.search(r'const\s+\{\s*([^}]+)\s*\}\s*=\s*require\(\s*["\'](\.\.?/config)["\']\s*\);?', content)
                if config_match:
                    imported_vars = config_match.group(1)
                    if 'JAVA_BACKEND_URL' not in imported_vars:
                        new_imported = imported_vars.strip()
                        if new_imported.endswith(','):
                            new_imported += ' JAVA_BACKEND_URL'
                        else:
                            new_imported += ', JAVA_BACKEND_URL'
                        content = content.replace(
                            config_match.group(0),
                            f'const {{ {new_imported} }} = require("{config_match.group(2)}");'
                        )
                else:
                    if 'routes' in path.parts:
                        import_line = 'const { JAVA_BACKEND_URL } = require("../config");\n'
                    else:
                        import_line = 'const { JAVA_BACKEND_URL } = require("./config");\n'
                    
                    parts = content.split('\n')
                    insert_at = 0
                    for i, line in enumerate(parts):
                        if 'require(' in line:
                            insert_at = i + 1
                    parts.insert(insert_at, import_line)
                    content = '\n'.join(parts)
                    
            if content != orig:
                path.write_text(content, encoding='utf-8')
                print(f'Patched backend-node file: {path.relative_to(root)}')

# 6. Patch backend Java files

# DBConnection
db_path = root / 'backend' / 'src' / 'main' / 'java' / 'com' / 'java' / 'database' / 'DBConnection.java'
db_text = '''package com.java.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static final String DB_URL = System.getenv("JAVA_DB_URL");
    private static final String DB_USER = System.getenv("JAVA_DB_USER");
    private static final String DB_PASSWORD = System.getenv("JAVA_DB_PASSWORD");

    public static Connection getConnection() {
        Connection conn = null;
        try {
            if (DB_URL == null || DB_USER == null || DB_PASSWORD == null) {
                throw new IllegalStateException("JAVA_DB_URL, JAVA_DB_USER, and JAVA_DB_PASSWORD are required.");
            }
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            System.out.println("✅ Database Connected Successfully!");
        } catch (ClassNotFoundException e) {
            System.err.println("❌ MySQL JDBC Driver not found!");
            e.printStackTrace();
        } catch (SQLException | IllegalStateException e) {
            System.err.println("❌ Database Connection Failed!");
            e.printStackTrace();
        }
        return conn;
    }

    public static void closeConnection(Connection con) {
        if (con != null) {
            try {
                con.close();
                System.out.println("✅ Database connection closed.");
            } catch (SQLException e) {
                System.err.println("❌ Error closing database connection!");
                e.printStackTrace();
            }
        }
    }
}
'''
if write_if_changed(db_path, db_text):
    print('Patched backend/src/main/java/com/java/database/DBConnection.java')

# JWTUtil
jwt_path = root / 'backend' / 'src' / 'main' / 'java' / 'com' / 'java' / 'utils' / 'JWTUtil.java'
jwt_text = '''package com.java.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import java.util.Date;
import java.security.Key;
import java.nio.charset.StandardCharsets;

public class JWTUtil {
    private static final String SECRET_KEY = System.getenv("JWT_SECRET");
    private static final String SECRET_KEY_BASE64 = System.getenv("JWT_SECRET_BASE64");

    private static Key getSigningKey() {
        if ((SECRET_KEY == null || SECRET_KEY.isBlank()) && (SECRET_KEY_BASE64 == null || SECRET_KEY_BASE64.isBlank())) {
            throw new IllegalStateException("JWT_SECRET or JWT_SECRET_BASE64 environment variable is required for token signing.");
        }
        byte[] keyBytes;
        if (SECRET_KEY_BASE64 != null && !SECRET_KEY_BASE64.isBlank()) {
            keyBytes = Decoders.BASE64.decode(SECRET_KEY_BASE64);
        } else {
            keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getSigningKey())
                .compact();
    }
}
'''
if write_if_changed(jwt_path, jwt_text):
    print('Patched backend/src/main/java/com/java/utils/JWTUtil.java')

# 7. Patch JSP pages to use DBConnection helper
for jsp in ['electionFormTable.jsp', 'vote.jsp']:
    jsp_path = root / 'backend' / 'src' / 'main' / 'webapp' / jsp
    content = jsp_path.read_text(encoding='utf-8')
    if 'DBConnection' not in content:
        content = content.replace('<%@ page import="java.sql.*" %>', '<%@ page import="java.sql.*" %>\\n<%@ page import="com.java.database.DBConnection" %>')
    content = content.replace('Connection con = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe", "username", "password");', 'Connection con = DBConnection.getConnection();')
    if content != jsp_path.read_text(encoding='utf-8'):
        jsp_path.write_text(content, encoding='utf-8')
        print(f'Patched backend/src/main/webapp/{jsp}')

# 8. Create .env.example
env_path = root / '.env.example'
env_text = '''# Java backend
JAVA_DB_URL=jdbc:mysql://localhost:3306/voting_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
JAVA_DB_USER=root
JAVA_DB_PASSWORD=rootpassword
JWT_SECRET_BASE64=VGhpc0lzQVNlY3JldEtleU15U2VjdXJlS2V5MTIzNDU2Nzg=  # 32+ byte base64 secret

# Node gateway
NODE_ENV=development
PORT=5000
JWT_SECRET=YourJwtSecretHere
SESSION_SECRET=YourSessionSecretHere
JAVA_BACKEND_URL=http://localhost:7070/backend
CORS_ORIGIN=http://localhost:3000

# React frontend
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:7070/backend/liveResults
'''
if write_if_changed(env_path, env_text):
    print('Created .env.example')

print('Plan fix script complete.')
