const axios = require("axios");
const config = require("./config");

async function Log(
  stack,
  level,
  packageName,
  message
) {
  try {
    if (!config.TOKEN) {
      throw new Error(
        "Bearer Token Missing. Authenticate first."
      );
    }

    const response = await axios.post(
      `${config.BASE_URL}/logs`,
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: config.TOKEN
        }
      }
    );

    console.log(
      "Log Created:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Logging Failed:",
      error.response?.data || error.message
    );

    throw error;
  }
}

module.exports = Log;
