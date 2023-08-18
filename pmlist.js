const fs = require("fs");
const path = require("path");
const PKG_MANAGER_NPM = "npm";
const PKG_MANAGER_YARN = "yarn";
const PKG_MANAGER_PNPM = "pnpm";
const rootDir = process.cwd();
const existLockFile = (lockType) => {
  try {
    fs.statSync(path.join(rootDir, lockType));
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  PKG_MANAGER_NPM,
  PKG_MANAGER_YARN,
  PKG_MANAGER_PNPM,
  existLockFile
};