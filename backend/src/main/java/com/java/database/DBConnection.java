package com.java.database;

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
            System.out.println("✅ MySQL Database Connected Successfully!");
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
