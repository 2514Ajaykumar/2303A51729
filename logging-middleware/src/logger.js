const axios = require("axios");
const { getToken } = require("./auth");
const config = require("./config");

async function Log(stack, level, pkg, message) {
  try {
    const token = await getToken();

    const response = await axios.post(
      `${config.BASE_URL}/logs`,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Logging Error:");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

module.exports = {
  Log
};