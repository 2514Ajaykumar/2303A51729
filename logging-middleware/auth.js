const axios = require("axios");
const config = require("./config");

async function authenticate(
  email,
  name,
  rollNo,
  accessCode,
  clientID,
  clientSecret
) {
  try {
    const response = await axios.post(
      `${config.BASE_URL}/auth`,
      {
        email,
        name,
        rollNo,
        accessCode,
        clientID,
        clientSecret
      }
    );

    config.TOKEN =
      `${response.data.token_type} ${response.data.access_token}`;

    console.log("Authentication Successful");

    return config.TOKEN;
  } catch (error) {
    console.error(
      "Authentication Failed:",
      error.response?.data || error.message
    );

    throw error;
  }
}

module.exports = authenticate;