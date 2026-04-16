const path = require("path");
const dotenv = require("dotenv");

const repoRoot = path.join(__dirname, "..", "..");
const envPaths = [path.join(repoRoot, ".env"), path.join(repoRoot, "env.example")];
let lastError;
for (const p of envPaths) {
  const result = dotenv.config({ path: p });
  if (!result.error) break;
  lastError = result.error;
}
if (lastError) {
  // eslint-disable-next-line no-console
  console.warn("Warning: could not load env file:", lastError.message);
}

const app = require("./app");

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});

