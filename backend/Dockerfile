# Stage 1: Build Java WAR using Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Deploy to Tomcat 9 (supports javax.servlet)
FROM tomcat:9.0-jdk17-corretto
COPY --from=build /app/target/backend.war /usr/local/tomcat/webapps/backend.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
