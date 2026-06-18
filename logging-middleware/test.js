const authenticate = require("./auth");
const Log = require("./logger");

async function main() {
  try {
    await authenticate(
      "2303a51729@sru.edu.in",
      "Ajay Kumar",
      "2303A51729",
      "bDreAq",
      "1e9fb6b2-e61c-4760-ad27-7a67f3ced1c2",
      "xrBrsPeQNEenbNHG"
    );

    await Log(
      "backend",
      "info",
      "service",
      "Logging Middleware Initialized"
    );
  } catch (error) {
    console.error(error);
  }
}

main();