package com.java.utils;

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
