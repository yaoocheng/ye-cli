const path = require('path');
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./generator.js');

module.exports = async function (name, options) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 创建的项目目录地址
    const targetDir = path.join(cwd, name);

    // 判断创建目录是否存在
    if (fs.existsSync(targetDir)) {
        // force=true强制覆盖 否则询问是否覆盖
        if (options.force) {
            await fs.remove(targetDir);
        } else {
            const { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: 'Target directory already exists Pick an action:',
                    choices: [
                        {
                            name: 'Overwrite',
                            value: 'overwrite'
                        }, {
                            name: 'Cancel',
                            value: false
                        }
                    ]
                }
            ])

            if (!action) {
                return
            } else if (action === 'overwrite') {
                await fs.remove(targetDir);

            }
        }
    }

    // 创建项目
    const generator = new Generator(name, targetDir);

    // 开始创建项目
    generator.create()
}