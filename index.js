#! /usr/bin/env node

const semver = require("semver");
const chalk = require("chalk");
const path = require("path");
const detectedWhichPMInuse = require('./validate_pm');
const commandList = require("./utils/commandList");
const { validCommandArgument, hasCommand } = require("./utils/hasCommand");

const args = process.argv.slice(2);
const rootDir = process.cwd();

const pkgInfo = require(path.join(rootDir, "package.json"));

const argumentsMapping = {
  targetNode: null,
  verifyPM: null
};

/**
 * @description 如果 package.json 中指定了 node 版本，则会使用该值作为 target node version
 *
 * 关于 engines 的使用，参考 @link https://docs.npmjs.com/cli/v9/configuring-npm/package-json#engines
 */
const getVersionFromPkgInfo = () => {
  if (pkgInfo.engines) {
    argumentsMapping.targetNode = pkgInfo.engines.node;
  }
};

const parseArguments = () => {
  // get from package.json
  getVersionFromPkgInfo();
  // get from arguments
  const commandArgTarget = hasCommand(commandList['-t'], args) || hasCommand(commandList['target'], args);
  if (commandArgTarget) {
    argumentsMapping.targetNode = commandArgTarget;
  }

  const commandArgPM = hasCommand(commandList['en-pm'], args) || hasCommand(commandList['enable-pm-verify'], args);
  if (commandArgPM) {
    argumentsMapping.verifyPM = commandArgPM;
  }
}

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
const detectedNodeVersionIfMatch = () => {
  if (!argumentsMapping.targetNode) {
    console.log(chalk.red(`未获取目标 node 版本信息，请参考 README.md 设置`));
    process.exit(1);
  }
  compareCurrentAndTarget();
};

const compareCurrentAndTarget = () => {
  const current = process.versions.node;
  const range = semver.validRange(argumentsMapping.targetNode);
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
};

parseArguments();


detectedNodeVersionIfMatch();

// 默认开启 包管理器 验证，想要关闭，enable-pm-verify false
if (!argumentsMapping.verifyPM || argumentsMapping.verifyPM === 'true') {
  detectedWhichPMInuse(pkgInfo);
}

process.exit(0);


