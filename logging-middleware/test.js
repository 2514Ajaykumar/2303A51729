const { Log } = require("./src");

async function main() {
  const result = await Log(
    "backend",
    "info",
    "service",
    "Logging middleware initialized successfully"
  );

  console.log(result);
}

main();