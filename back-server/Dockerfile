FROM adoptopenjdk/openjdk8 AS builder
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew
RUN ./gradlew bootJAR

FROM adoptopenjdk/openjdk8
COPY --from=builder build/libs/*.jar app.jar
EXPOSE 10080
ENTRYPOINT ["java", "-jar", "/app.jar"]