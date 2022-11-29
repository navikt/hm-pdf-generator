FROM ghcr.io/navikt/baseimages/temurin:17

COPY app/build/libs/app-all.jar app.jar
