import { RC, DEFAULTS } from "./constant.js";
//RC是配置文件 DEFAULT是默认配置
//promisify：异步函数promise化
import { decode, encode } from "ini"; //格式分析和序列化
import { promisify } from "util";
import fs from "fs";

let exists = promisify(fs.exists); // 测试某个路径下的文件是否存在
let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);

export let get = async (k) => {
  let has = await exists(RC);
  let opts;
  if (has) {
    opts = await readFile(RC, "utf8");
    opts = decode(opts);
    return opts[k];
  }
  return "";
};

export let set = async (k, v) => {
  let has = await exists(RC);
  let opts;
  if (has) {
    opts = await readFile(RC, "utf8");
    opts = decode(opts);
    Object.assign(opts, { [k]: v });
  } else {
    // 如果不存在就合并DEFAULTS 进入opts参数
    opts = Object.assign(DEFAULTS, { [k]: v });
  }
  await writeFile(RC, encode(opts), "utf8"); // utf8写文件, 不存在则新建
};

export let remove = async (k) => {
  let has = await exists(RC);
  let opts;
  if (has) {
    opts = await readFile(RC, "utf8");
    opts = decode(opts);
    delete opts[k];
    await writeFile(RC, encode(opts), "utf8");
  }
};
export let getAll = async (k, v) => {
  let has = await exists(RC);
  let opts;
  if (has) {
    opts = await readFile(RC, "utf8");
    opts = decode(opts);
    return opts;
  }
  return Object.assign(DEFAULTS, { [k]: v });
};
