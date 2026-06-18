const { getToken } = require(
  "../../logging-middleware/src/auth"
);

async function getAccessToken() {
  const token = await getToken();

  return `Bearer ${token}`;
}

module.exports = {
  getAccessToken
};