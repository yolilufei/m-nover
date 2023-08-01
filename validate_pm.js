const {
    PKG_MANAGER_NPM,
    PKG_MANAGER_YARN,
    PKG_MANAGER_PNPM,
    existLockFile
  } = require("./pmlist");
/**
 * @description 检查当前命令实现的包管理器，目前包含了 npm、yarn、pnpm 三种
 * 注意：如果项目之前是通过 pnpm 管理的，因为pnpm本身支持包管理器的判断，因此可以忽略包管理器的检查功能
 */
const detectedWhichPMInuse = async () => {
  let pkgManager = "";
  if (pkgInfo.packageManager) {
    pkgManager = [PKG_MANAGER_NPM, PKG_MANAGER_YARN, PKG_MANAGER_PNPM].find(pm => pkgInfo.packageManager.startsWith(pm));
  }
  if (await existLockFile('package-lock.json')) {
    pkgManager = PKG_MANAGER_NPM;
  }
  if (await existLockFile('yarn.lock')) {
    pkgManager = PKG_MANAGER_YARN;
  }
  if (await existLockFile('pnpm-lock.yaml')) {
    pkgManager = PKG_MANAGER_PNPM;
  }

  const current_exec_pm = process.env.npm_execpath;
  if (!pkgManager || current_exec_pm.indexOf(pkgManager) > -1) {
    process.exit(0);
  } else {
    console.log(chalk.red('当前运行的包管理器和项目使用的包管理器不一致'));
    console.log("项目使用的包管理器: ",  chalk.yellow(pkgManager));
    process.exit(1);
  }
};

module.exports = detectedWhichPMInuse;