## m-nover
- 校验执行命令时的node版本和项目实际使用的node版本是否一致
- 校验执行命令时的包管理器和项目实际使用的包管理器是否一致

## 使用场景
如果你同时需要维护多个项目，项目运行要求的 node 版本 和 包管理器存在差异时，推荐使用。
## 安装
### npm
``` npm install m-nover -D ``` 
### yarn
``` yarn add -D m-nover ```
### pnpm
``` pnpm add -D m-nover ```

## 使用方式
m-nover 目前只提供了 bin 文件，因此可以在 package.json 中的 npm scripts 脚本中使用。
1. scripts 使用方式
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
    执行效果和上面的方式是一致的，比较好的一点是不用改动原有的命令。关于 **Pre & Post Scripts** 的使用方式，可以参考：[npm scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts)

## 参数说明

```-t```: target 目标版本, 后跟项目运行实际需要的 node 版本

## 设置目标 node 版本
m-nover 获取目标 node 版本的来源有两个：package.json 中的 [engines](https://docs.npmjs.com/cli/v9/configuring-npm/package-json/#engines) 和 脚本参数(arguments)。

**其中 脚本参数的优先级要高于 engines**。  
例如：
```javascript 
  "scripts": {
    "prestart": "m-nover -t ^18"
  }
 or
  "engines": { "node": "^16" }
```
目标 node 版本 会使用 18 作为实际的 node 版本。如果没有脚本参数，会默认使用 engines 的设置作为目标版本

## 目标 node 版本支持 semver 

## 关于 [engine-strict](https://docs.npmjs.com/cli/v6/using-npm/config?v=true#engine-strict)

## 关于包管理器的判断逻辑