const axios = require("axios");
const config = require("./config");

let token = null;

async function getToken() {
  if (token) return token;

  const response = await axios.post(
    `${config.BASE_URL}/auth`,
    {
      email: config.EMAIL,
      name: config.NAME,
      rollNo: config.ROLL_NO,
      accessCode: config.ACCESS_CODE,
      clientID: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET
    }
  );

  token = response.data.access_token;

  return token;
}

module.exports = {
  getToken
};