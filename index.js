#! /usr/bin/env node

const semver = require('semver');
const chalk = require('chalk');
const path = require('path');
const args = process.argv.slice(2);
const rootDir = process.cwd();
let targetVersion;

const pkgInfo = require(path.join(rootDir, 'package.json'));


/**
 * @description 只获取第一个脚本参数，默认第一个参数即是 node version
 *
 *  例如：nover --target ^18 ~16 只会获取 18 作为目标参数
 * 
 * 参数可以是任意符合规范的 semantic version, 可以参考 @link https://github.com/npm/node-semver#versions
 */
const getVersionFromArgs = () => {
    if (args.length > 1) {
        targetVersion = args[1];
    }
}

/**
 * @description 如果 package.json 中指定了 node 版本，则会使用该值作为 target node version
 * 
 * 关于 engines 的使用，参考 @link https://docs.npmjs.com/cli/v9/configuring-npm/package-json#engines
 */
const getVersionFromPkgInfo = () => {
    if (pkgInfo.engines && pkgInfo.engines.node) {
        targetVersion = pkgInfo.engines.node;
    }
}
/**
 * @description 获取 target node version 信息，有两个来源：package.json 中的 engines 和 脚本参数(arguments)
 * 
 * 其中 脚本参数的优先级要高于 engines，例如：
 * 
 * "prestart": nover --target ^18
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
    if (!semver.valid(targetVersion)) {
        console.log(chalk.red(`目标版本信息设置错误，请参考 README.md 设置`));
        process.exit(1);
    }
    compareCurrentAndTarget();
}

const compareCurrentAndTarget = () => {
    const current = process.versions.node;
    const valid = semver.satisfies(current, targetVersion);
    console.log('valid', current, targetVersion, valid);
}

console.log(semver.inc('19.0.0', semver.release));
getTargetVersion();