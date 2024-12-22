const { exec } = require("child_process");
const { promisify } = require("util");
const { glob } = require("glob");

const execAsync = promisify(exec);

async function updateSecret(secretName, path) {
  try {
    const deleteResult = await execAsync(
      `kubectl delete secret ${secretName} --ignore-not-found`
    );
    console.log(`stdout: ${deleteResult.stdout}`);
  } catch (error) {
    console.error(`Error deleting secret: ${error.message}`);
    return;
  }

  try {
    const createResult = await execAsync(
      `kubectl create secret generic ${secretName} --from-env-file=${path}`
    );
    console.log(`stdout: ${createResult.stdout}`);
  } catch (error) {
    console.error(`Error creating secret: ${error.message}`);
  }
}

const secrets = glob.sync("./cluster/**/.env");

secrets.forEach((secret) => {
  const secretName = `${secret.split("/").at(-2)}-env`;
  const path = `${process.cwd()}/${secret}`;
  updateSecret(secretName, path);
});
