# ---- Frontend build ----
FROM node:22-alpine AS frontend-build
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build -- --base-href /board-games/

# ---- Backend build ----
FROM eclipse-temurin:21-jdk AS backend-build
WORKDIR /backend

COPY backend/ ./

# Copy Angular build output to backend
COPY --from=frontend-build /frontend/dist/boardgames-frontend/browser/ ./src/main/resources/static/

RUN sed -i 's/\r$//' gradlew && chmod +x gradlew && ./gradlew bootJar --no-daemon

# ---- Runtime ----
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=backend-build /backend/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
