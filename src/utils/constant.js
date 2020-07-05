import { version } from "../../package.json";
import Home from "user-home"

export const VERSION = version; // 当前package.json的版本号

export const RC = `${Home}/.sunclirc`;
//要下载的模板下载目录
export const DOWNLOAD=`${Home}/.sun_template`;

//RC配置下载(模板)的地方
//给github的api来用的
export const DEFAULTS = {
  registry: 'swj-git', // 存放模板的组织
  type: 'orgs'
}

