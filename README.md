## 前置：你可能并不需要这个包

如果你仅仅想要控制执行 npm scripts 的 node 版本, 可以在 [package.json config][1] 中添加 `engine-strict: true` 实现。

## m-nover

一个简单的用于验证 `node` 版本 和 包管理器(`npm、yarn`)是否符合期望的命令工具

## Features

- 执行 `npm scripts` 前验证 `node` 版本 和 包管理器(`npm、yarn`)是否符合期望
- 期望的 `node` 版本定义遵循 `semantic version` 规范

## 使用场景

- 如果你同时需要维护多个项目，项目运行要求的 `node` 版本 和 包管理器存在差异时，推荐使用。

## 安装

#### npm

` npm install -D m-nover `

#### yarn

` yarn add -D m-nover `

#### pnpm (pnpm 本身支持该能力，无需使用)

<s>`pnpm install -D m-nover`</s>

## 设置目标 node 版本

m-nover 获取目标 `node` 版本的来源有两个：`package.json` 中的 [engines](https://docs.npmjs.com/cli/v9/configuring-npm/package-json/#engines) 和 脚本参数(`arguments`)。

**其中 脚本参数 的优先级要高于 engines**。  
例如：

```javascript
  "scripts": {
    "prestart": "m-nover -t ^18"
  }
  
 or

  "engines": { "node": "^16" }
```

目标 `node` 版本 会使用 *18* 作为实际的 `node` 版本。如果没有脚本参数，会默认使用 `engines` 的设置作为目标版本

## 使用方式

m-nover 目前只提供了 bin 文件，因此可以在 package.json 中的 `npm scripts` 脚本中使用。

1. 通过 && 组合要执行的命令  

     ```javascript
       "scripts": {
         "start": "m-nover && other command",
         "build": "m-nover && other command"
       }
     ```

     当执行 ```npm run start``` 或者 ```npm run build``` 时，m-nover 会首先校验当前执行命令使用的 node 版本和项目实际需要的版本是否一致。  
     **如果不一致，会提示错误信息并阻止后续命令执行。**  
     **如果一致，则会继续执行后续的命令。**

2. 使用 Pre & Post Scripts

    ```javascript
        "scripts": {
          "prestart": "m-nover",
          "start": "other command",
          "prebuild": "m-nover",
          "build": "other command"
        }
     ```

    执行效果和上面的方式是一致的，比较好的一点是不用改动原有的命令。关于 **`Pre & Post Scripts`** 的使用方式，可以参考：[npm scripts][2]

## 参数说明

- `-t`（不推荐）: &ensp;设置 `node` 目标版本, 后跟项目运行实际需要的 `node` 版本。使用方式为 `-t node-version`, 比如: `-t 18`, `-t ^18`, `-t ~18`
- `target`（推荐）: &ensp;同 `-t`, 使用方式为 `target=node-version`, 比如: `target=18`, `target=^18`, `target=~18`
- `en-pm`: &ensp;设置是否启用包管理器验证，默认是开启的，如果想关闭，可以设置`en-pm=false`
- `enable-pm-verify`: &ensp;同 `en-pm`

[1]: https://docs.npmjs.com/cli/v6/using-npm/config?v=true#engine-strict
[2]: https://docs.npmjs.com/cli/v9/using-npm/scripts
