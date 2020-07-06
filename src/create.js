// 下载模板 选择模板使用
// 用过配置文件 获取模板信息(有哪些模板)
import { repoList, tagList, downloadLocal,} from './utils/git';
import { VERSION } from './utils/constant'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { promisify } from "util"; //
let ncp = require('ncp'); // 实现文件的拷贝功能
ncp = promisify(ncp);

import validateProjectName from 'validate-npm-package-name'
import inquirer from 'inquirer';
import {waitFnloading, createSuc, delFolderRecursion} from './utils/interaction'


/**
 * 初始化项目
 * @param {*} projectName 
 * @param {*} options  默认初始化git
 */
let create = async (projectName, options={ git: true}) => {
  if(!projectName) {
    console.log(`> ${chalk.red('Missing required argument <app-name>')}`)
    return
  }
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')

  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    exit(1) // 非0表失败
  }
// 同步读取目录,如果存在,且强制命令,删除,重新建立
  if(fs.existsSync(targetDir)) {
    console.log(options.force)
    if(options.force) {
      await  delFolderRecursion(targetDir)
    } else {
      console.log(chalk.bold.blue(`Sun CLI v${VERSION}`))
      if(inCurrent) {
        const { ok } = await inquirer.prompt([{
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`
        }])
        if(!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exists.
            Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: false }
            ]
          }
        ])
        if(!action) {
          return
        } else if(action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
           
          await delFolderRecursion(targetDir)
        }
      }
    }
  }
 /* 开始创建 */
let repos = await waitFnloading(repoList, 'fetch template ....')();
repos = repos.map((item) => item.name); // 获取模板的名字
  // 选择模板 inquirer
  const  {project} = await inquirer.prompt({
    // 在命令行中询问客户问题
    name: 'project', // 当前项目得名字，获取选择后的结果
    type: 'list',
    message: 'please choise a template to create project',
    choices: repos, // 选则得列表
  });

  // 通过当前选择的项目，拉取对应的版本
  // 获取对应的版本号
  let tags = await waitFnloading(tagList, 'fetch tags ....')(project)
  tags = tags.map((item) => item.name)

  const { tag } = await inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choise tags to create project',
    choices: tags,
  });

  // 把模板放到一个临时目录里存好，以备后期使用
  const dest = await waitFnloading(downloadLocal, 'download template')(project, tag)

 
    /**
     * 把模板从临时目录中拷贝到当前项目里
     * 如果有ask.js文件直接下载
     */
    if (!fs.existsSync(path.join(dest, 'ask.js'))) {
      // 复杂的需要模板熏染 渲染后再拷贝
      // 把template下的文件 拷贝到执行命令的目录下
      // 在这个目录下 项目名字是否已经存在 如果存在示当前已经存在
      await ncp(dest, path.resolve(targetDir))
      createSuc(projectName)
    } else {
      // 复杂的模板,把git上的项目下载下来，如果有ask文件就是一个复杂的模板，我们需要用户选择，选择后编译模板
      // metalsmith--模板编译需要这个包
      // 需要渲染模板的接口：https://github.com/zhu-cli/vue-template/blob/master/package.json
  
      // 1.让用户填信息
      await new Promise((resolve, reject) => {
        MetalSmith(__dirname) // 如果你传入路径，默认遍历当前路径下的src文件夹
          .source(dest)
          .destination(path.resolve(targetDir))
          .use(async (files, metal, done) => {
            const args = require(path.join(dest, 'ask.js'));
            const obj = await inquirer.prompt(args);
  
            const meta = metal.metadata();
            Object.assign(meta, obj);
            delete files['ask.js'];
            done();
          })
          .use((files, metal, done) => {
            const obj = metal.metadata();
            Reflect.ownKeys(files).forEach(async (file) => {
              // 是要处理的文件
              if (file.includes('js') || file.includes('json')) {
                let content = files[file].contents.toString(); // 文件的内容
                if (content.includes('<%')) {
                  content = await render(content, obj);
                  files[file].contents = Buffer.from(content); // 渲染结果
                }
              }
            });
            // 2.让用户填写的信息取渲染模板
            // 根据用户新的输入 下载模板
            done();
          })
          .build((err) => {
            if (err) {
              reject();
            } else {
              resolve();
            }
          });
      });
      createSuc(projectName)
    }

}

export default create;