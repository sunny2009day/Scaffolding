/**
 * 命令行的命令名称拿到后  这个是主流程控制的地方
 */
import { betterRequire } from './utils/common';
import { resolve } from 'path'

let apply = (action, ...args) => {
  //babel-env  export default=>module.exports={default:xxx}
    betterRequire(resolve(__dirname, `./${action}`))(...args) //默认导出
}
export default apply;