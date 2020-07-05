export const betterRequire = (absPath) => {
  
  //两种引入方式
  let module = require(absPath);
  if(module.default){
      return module.default;
  }
  return module;
}
/**
 * 参数转小写
 * @param {*} str 
 */
export const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}
// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
export const cleanArgs = (cmd) => {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
