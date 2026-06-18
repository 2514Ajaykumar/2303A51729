const axios = require("axios");
const config = require("../config/config");
const { getAccessToken } = require(
  "../middleware/auth"
);

async function getDepots() {
  const token = await getAccessToken();

  const response = await axios.get(
    `${config.BASE_URL}${config.ENDPOINTS.DEPOTS}`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  return response.data.depots;
}

module.exports = {
  getDepots
};