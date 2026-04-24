const axios = require("axios");

const QKD_SERVICE_URL = process.env.QKD_SERVICE_URL || "http://localhost:8001";

const qkdApi = axios.create({
  baseURL: QKD_SERVICE_URL,
  timeout: 5000,
});

module.exports = qkdApi;