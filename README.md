## nover
校验执行命令时的node版本和项目实际使用的node版本是否一致

## 安装
### npm
``` npm install nover -D ``` 
### yarn
``` yarn add -D nover ```
### pnpm
``` pnpm add -D nover ```

## 使用方式
nover 目前只提供了bin文件，因此可以在 package.json 中的 npm scripts 脚本中使用。
1. scripts 使用方式
   1. 通过 && 组合要执行的命令  
     ```javascript
       "scripts": {
         "start": "nover && other command",
         "build": "nover && other command"
       }
     ```
     当执行 ```npm run start``` 或者 ```npm run build``` 时，nover 会首先校验当前执行命令使用的 node 版本和项目实际需要的版本是否一致。  
     **如果不一致，会提示错误信息并阻止后续命令执行。**  
     **如果一致，则会继续执行后续的命令。**  
   2. 使用 Pre & Post Scripts
    ```javascript
        "scripts": {
          "prestart": "nover",
          "start": "other command",
          "prebuild": "nover",
          "build": "other command"
        }
     ```
    执行效果和上面的方式是一致的，比较好的一点是不用改动原有的命令。关于 **Pre & Post Scripts** 的使用方式，可以参考：[npm scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts)

## 设置目标 node 版本
nover 获取目标 node 版本的来源有两个：package.json 中的 [engines](https://docs.npmjs.com/cli/v9/configuring-npm/package-json/#engines) 和 脚本参数(arguments)。

**其中 脚本参数的优先级要高于 engines**。  
例如：
```javascript 
  "scripts": {
    "prestart": "nover -t ^18"
  }
 or
  "engines": { "node": "^16" }
```
目标 node 版本 会使用 18 作为实际的 node 版本。如果没有脚本参数，会默认使用 engines 的设置作为目标版本