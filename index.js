#! /usr/bin/env node

const semver = require("semver");
const chalk = require("chalk");
const path = require("path");

const args = process.argv.slice(2);
const rootDir = process.cwd();
let targetVersion;

const pkgInfo = require(path.join(rootDir, "package.json"));

/**
 * @description 只获取第一个脚本参数，默认第一个参数即是 node version
 *
 *  例如：m-nover -t ^18 ~16 只会获取 18 作为目标参数
 *
 * 参数可以是任意符合规范的 semantic version, 可以参考 @link https://github.com/npm/node-semver#versions
 */
const getVersionFromArgs = () => {
  if (args.length > 1) {
    targetVersion = args[1];
  }
};

/**
 * @description 如果 package.json 中指定了 node 版本，则会使用该值作为 target node version
 *
 * 关于 engines 的使用，参考 @link https://docs.npmjs.com/cli/v9/configuring-npm/package-json#engines
 */
const getVersionFromPkgInfo = () => {
  if (pkgInfo.engines && pkgInfo.engines.node) {
    targetVersion = pkgInfo.engines.node;
  }
};
/**
 * @description 获取 target node version 信息，有两个来源：package.json 中的 engines 和 脚本参数(arguments)
 *
 * 其中 脚本参数的优先级要高于 engines，例如：
 *
 * "prestart": m-nover -t ^18
 *
 * "engines": { "node": ^16 }
 *
 * target node version 会使用 18
 *
 * 如果没有脚本参数，会默认使用 engines 的设置作为目标版本
 */
const getTargetVersion = () => {
  getVersionFromPkgInfo();
  getVersionFromArgs();
  if (!targetVersion) {
    console.log(chalk.red(`未获取目标版本信息，请参考 README.md 设置`));
    process.exit(1);
  }
  compareCurrentAndTarget();
};

const compareCurrentAndTarget = () => {
  const current = process.versions.node;
  const range = semver.validRange(targetVersion);
  if (!range) {
    console.log(chalk.red(`目标版本信息设置错误，请参考 README.md 设置`));
    process.exit(1);
  }
  const matched = semver.satisfies(current, range);
  if (!matched) {
    console.log(
      chalk.red("当前 node 版本与目标 node 版本不一致，请切换当前 node 版本")
    );
    console.log("当前 node 版本: ", chalk.yellow(current));
    console.log("目标 node 版本: ", chalk.yellow(range));
    process.exit(1);
  }
  console.log(chalk.green("当前 node 版本与目标 node 版本一致"));
  process.exit(0);
};
getTargetVersion();
// const {
//     PKG_MANAGER_NPM,
//     PKG_MANAGER_YARN,
//     PKG_MANAGER_PNPM,
//     existLockFile
//   } = require("./pmlist");
// let pkgManager = "npm";



// const detectedWhichPMInuse = async () => {
//   if (pkgInfo.packageManager) {
//     pkgManager = [PKG_MANAGER_NPM, PKG_MANAGER_YARN, PKG_MANAGER_PNPM].find(pm => pkgInfo.packageManager.startsWith(pm));
//   }
//   if (await existLockFile('package-lock.json')) {
//     pkgManager = PKG_MANAGER_NPM;
//   }
//   if (await existLockFile('yarn.lock')) {
//     pkgManager = PKG_MANAGER_YARN;
//   }
//   if (await existLockFile('pnpm-lock.yaml')) {
//     pkgManager = PKG_MANAGER_PNPM;
//   }
// };

// detectedWhichPMInuse();