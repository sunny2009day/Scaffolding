import ora from "ora"; //进度条
import chalk from "chalk";
import fs from "fs";
import path from "path";

export const waitFnloading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  const result = await fn(...args);
  spinner.succeed();
  return result;
};

export const createSuc = (projectName) => {
  console.log(
    `${chalk.green("🎉  Successfully created project")} ${chalk.yellow(
      projectName
    )}.`
  );
};

export const delFolderRecursion = (url) => {
  let files = [];
  /**
   * 判断给定的路径是否存在
   */
  if (fs.existsSync(url)) {
    /**
     * 返回文件和子目录得数组
     */
    files = fs.readdirSync(url);
    files.map((file, index) => {
      let curPath = path.join(url, file);
      /**
       * stasSync同步读取文件夹,如果是文件夹，在重复出发函数
       */
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        delFolderRecursion(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    /**
     * 清除文件夹
     */
    fs.rmdirSync(url);
  } else {
    console.log("给定的路径不存在，请给出正确的路径");
  }
};
