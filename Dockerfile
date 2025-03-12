FROM gcr.io/distroless/java21-debian12:nonroot
WORKDIR /app
COPY app/build/libs/app-all.jar app.jar
ENV TZ="Europe/Oslo"
EXPOSE 8082
CMD ["./app.jar"]
