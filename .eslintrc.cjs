module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  ignorePatterns: ["dist/", "coverage/", "node_modules/"],
  rules: {
    "no-unused-vars": "off"
  }
};

