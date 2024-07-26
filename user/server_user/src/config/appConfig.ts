// loading env variables
import "dotenv/config";

export const config = {
    PORT: parseInt(process.env.PORT || "7001"),
    CONN_STR: process.env.MONGO_URL || "mongodb://localhost:27017",
    DB_NAME: process.env.DBNAME || "subscription",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET||"hiii",
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    MAILJET_API_KEY :"Your_API-Key",
    MAILJET_SECRET_KEY :"Your_SecretKey"
}