const axios = require("axios");
const config = require("../config/config");
const { getAccessToken } = require(
  "../middleware/auth"
);

async function getVehicles() {
  const token = await getAccessToken();

  const response = await axios.get(
    `${config.BASE_URL}${config.ENDPOINTS.VEHICLES}`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  return response.data.vehicles;
}

module.exports = {
  getVehicles
};