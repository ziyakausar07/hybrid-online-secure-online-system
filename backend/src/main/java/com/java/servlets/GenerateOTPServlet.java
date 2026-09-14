package com.java.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.concurrent.*;

import javax.mail.Message;
import javax.mail.*;
import javax.mail.internet.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

@WebServlet("/GenerateOTPServlet")
public class GenerateOTPServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // ✅ OTP Storage (Auto Remove after 5 min)
    private static final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    // ✅ Gmail SMTP Credentials (Use App Password)
    private static final String SENDER_EMAIL = "ziyakaus07@gmail.com";
    private static final String SENDER_PASSWORD = "hjbk xtgd xfng xags";  // ✅ Replace with App Password

    public static String getOtp(String email) {
        return otpStorage.get(email);
    }

    public static void removeOtp(String email) {
        otpStorage.remove(email);
    }

    @Override
    public void destroy() {  
        // ✅ Memory Leak Fix: Scheduler ko shutdown karna
        scheduler.shutdownNow();
        System.out.println("Scheduler stopped to prevent memory leak.");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            // ✅ JSON Body Read karna
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            JSONObject jsonRequest = new JSONObject(sb.toString());

            // ✅ JSON se email extract karna
            String userEmail = jsonRequest.optString("email", "").trim();

            // ✅ Email validation
            if (userEmail.isEmpty()) {
                out.print("{\"success\": false, \"error\": \"Email is required\"}");
                return;
            }

            try {
                InternetAddress emailAddr = new InternetAddress(userEmail);
                emailAddr.validate();
            } catch (AddressException e) {
                out.print("{\"success\": false, \"error\": \"Invalid email format\"}");
                return;
            }

            // ✅ 6-digit OTP generate karna
            Random rand = new Random();
            String otp = String.format("%06d", rand.nextInt(1000000));
            
System.out.println("Generated OTP: " + otp);
            // ✅ OTP store karna (Auto delete after 5 min)
            otpStorage.put(userEmail, otp);
            scheduler.schedule(() -> removeOtp(userEmail), 5, TimeUnit.MINUTES);

            // ✅ SMTP Properties Set karna (Google SMTP)
            Properties props = new Properties();
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.ssl.trust", "smtp.gmail.com");

            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(SENDER_EMAIL, SENDER_PASSWORD);
                }
            });

            session.setDebug(true); // ✅ Debugging Enable karein

            // ✅ Email Send karna
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SENDER_EMAIL));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(userEmail));
            message.setSubject("Your OTP for Voting");
            message.setText("Your OTP is: " + otp + "\nThis OTP is valid for 5 minutes.");

            Transport.send(message);
            System.out.println("OTP sent successfully to " + userEmail);
            // ✅ Send OTP in the JSON response (for debugging)
out.print("{\"success\": true, \"message\": \"OTP sent successfully to " + userEmail + "!\"," +
"\"otp\": \"" + otp + "\"}");

        } catch (AuthenticationFailedException e) {
            out.print("{\"success\": false, \"error\": \"Authentication Failed! Check your email and app password.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"success\": false, \"error\": \"Internal Server Error\"}");
        }
    }
}
