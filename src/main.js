import program from "commander"
import { VERSION } from "./utils/constant.js"
import apply from './index.js'
import { cleanArgs } from './utils/common'

//多种功能命令
let actionMap = {
  create: {
    //配置命令的名字
    alias: "c", //命令别的名称
    description: "create a project", //命令对应的描述
    examples: [
      //命令对应的模板
      "sun c <project-name>",
      "sun create <project-name>",
    ],
  },
  config: {
    alias: "conf",
    description:"create project variable, config .sunclirc",
    examples: [
      "sun config set <k> <v>",
      "sun config get <k>",
      "sun config remove <k>",
    ],
  },
  "*": {
    alias: '',
    description: "command not found",
    examples: [],
  },
}

Object.keys(actionMap).forEach((action) => {
  program
    .command(action)
    .description(actionMap[action].description)
    .alias(actionMap[action].alias)
    .action((name, cmd) => {
      //  const options = cleanArgs(name)

      //判断一下当前用的是什么操作
      if (action === "config") {
        //实现更改配置文件
        //console.log(process.argv)//数组

      }
      apply(action, ...process.argv.slice(3)) // process.argv.slice(3)嵌套的数组
    })
})

function help() {
  // console.log('123')//把example显示出去
  console.log("\r\n  " + "how to use command")
  Object.keys(actionMap).forEach((action) => {
    actionMap[action].examples.forEach((example) => {
      console.log("  - " + example)
    })
  })
}
program.on("-h", help)
program.on("--help", help)
program.version(VERSION, "-v --version").parse(process.argv)
