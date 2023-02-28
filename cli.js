#! /usr/bin/env node

const program = require('commander')
const figlet = require('figlet');

program
    // 定义命令和参数
    .command('create <app-name>')
    .description('create a new project')
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        // 执行创建任务
        require('./lib/create.js')(name, options);
    })

program
    // 配置版本号信息
    .version(`v${require('./package.json').version}`)
    .usage('<command> [option]')

// 监听用户帮助命令
program.on('--help', function () {
    // 绘制👴的logo
    console.log('\r\n' + figlet.textSync('YE-CLI', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));
})

// 解析用户执行命令传入参数
program.parse(process.argv);