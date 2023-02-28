const util = require('util')
const path = require('path');
const ora = require('ora')
const chalk = require('chalk');
const downloadGitRepo = require('download-git-repo') // 不支持 Promise


// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();
    try {
        // 执行传入方法 fn
        await fn(...args);
        // 状态为修改为成功
        spinner.succeed();
        return true;
    } catch (error) {
        // 状态为修改为失败
        spinner.fail('Request failed...')
    }
}

// 创建模板类
class Generator {
    constructor(name, targetDir, templateName) {
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;
        // 模板名
        this.templateName = templateName;
        // 对 download-git-repo 进行 promise 化改造
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    // 下载远程模板
    async download(repo) {
        // 拼接下载地址
        const requestUrl = `yc-cooding/${repo}`;

        // 调用下载方法
        const res = await wrapLoading(
            this.downloadGitRepo, // 远程下载方法
            'waiting download template', // 加载提示信息
            requestUrl, // 参数1: 下载地址
            path.resolve(process.cwd(), this.targetDir)) // 参数2: 项目创建位置
        return res;
    }

    // 下载模板到模板目录
    // 模板使用提示
    async create() {
        // 下载到目录
        const res = await this.download(this.templateName);

        if (res) {
            // 模板使用提示
            console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
            console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
            console.log('\r\n  npm install')
            console.log('\r\n  npm run dev\r\n')
        }
    }
}

module.exports = Generator;