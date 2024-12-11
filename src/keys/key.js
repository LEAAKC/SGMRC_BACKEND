import configuraciones from "../config/config.js";

export const URI = `mongodb+srv://${configuraciones.DB_CREDENTIALS_USER}:${configuraciones.DB_CREDENTIALS_PASSWORD}@cluster0.gnv2a.mongodb.net/`;
