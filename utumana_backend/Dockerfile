FROM openjdk:17-jdk-alpine

LABEL maintainer="peoplefirst.ws"

WORKDIR /app
COPY target/utumana_backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
