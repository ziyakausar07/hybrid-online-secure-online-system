package com.java.servlets;

import java.io.IOException;
import java.sql.*;
import java.util.*;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import javax.json.*; // ✅ Java built-in JSON API
import com.java.database.DBConnection;

@ServerEndpoint("/liveResults")
public class LiveResults {

    private static Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("Client connected: " + session.getId());
        sendLiveResults();
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        if ("getResults".equalsIgnoreCase(message)) {
            sendLiveResults();
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        System.out.println("Client disconnected: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("WebSocket Error: " + throwable.getMessage());
    }

    private void sendLiveResults() {
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(
                 "SELECT c.name AS candidate_name, COUNT(v.id) AS total_votes " +
                 "FROM candidates c LEFT JOIN votes v ON c.id = v.candidate_id GROUP BY c.name"
             )) {
    
            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
    
            while (rs.next()) {
                JsonObject result = Json.createObjectBuilder()
                        .add("name", rs.getString("candidate_name"))
                        .add("votes", rs.getInt("total_votes"))
                        .build();
                arrayBuilder.add(result);
            }
    
            String json = arrayBuilder.build().toString();
    
            synchronized (sessions) {
                for (Session s : sessions) {
                    try {
                        if (s.isOpen()) {
                            s.getBasicRemote().sendText(json);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
    
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
}