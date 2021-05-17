require('dotenv').config();

const __salesCloudGatewayUrl = () => {
  for (const envVar in process.env) {
    if (envVar !== undefined && envVar.startsWith("SAP_SALES_CLOUD") && envVar.endsWith("GATEWAY_URL")) {
      return process.env[envVar]
    }
  }
  return process.env.GATEWAY_URL;
}

module.exports = Object.freeze({
  server: {
    port: process.env.PORT || 8080,
    eventsBaseURL: "/"
  },
  googleAPIKey: process.env.GOOGLE_API_KEY,
  salesCloud: {
    accountsBaseURL: __salesCloudGatewayUrl(),
  }
});
