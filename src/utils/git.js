import request from "request";
import { getAll } from "./rc";
import downLoadGit from "download-git-repo";
import { DOWNLOAD } from "./constant";

let fetch = async (url) => {
  return new Promise((resolve, reject) => {
    let config = {
      url,
      method: "get",
      headers: {
        // (平台) 引擎版本 浏览器版本号
        "user-agent": "sun", // 告诉服务器通过什么工具来访问,尽然随便设置
      },
    };
    request(config, (err, response, body) => {
      if (err) {
        reject(err);
      }
      console.log("请求：" + url + "返回");
      resolve(JSON.parse(body));
    });
  });
};
// 获取tagList
export let tagList = async (repo) => {
  let config = await getAll();
  let api = `https://api.github.com/repos/${config.registry}/${repo}/tags`;
  return await fetch(api);
};
export let repoList = async () => {
  let config = await getAll();
  let api = `https://api.github.com/${config.type}/${config.registry}/repos`;
  console.log("api==========================");
  console.log(api);
  return await fetch(api);
};
export let download = async (src, dest) => {
  return new Promise((resolve, reject) => {
    downLoadGit(src, dest, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
/**
 * 下载到本地
 * @param {*} project
 * @param {*} version
 * @return {string} 本地目录
 */

export let downloadLocal = async (project, version) => {
  let config = await getAll();
  let api = `${config.registry}/${project}`;
  if (version) {
    api += `#${version}`;
  }
  const localDest = DOWNLOAD + "/" + project;
  await download(api, localDest);
  return localDest;
};
