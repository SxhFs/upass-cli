#!/usr/bin/env node

let program = require('commander');
let chalk = require('chalk');
let inquirer = require('inquirer');
let path = require('path');
let rm = require('rimraf').sync;
let uuidV1 = require('uuid/v1');
let ora = require('ora');
let os = require('os');
let download = require('download-git-repo');
let generate = require('../lib/generate');
let utils = require('../lib/utils');

program
    .usage('<template-name> [project-name]')
    .option('-c, --clone', 'use git clone')

program.on('--help', function () {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # create a new project with an template.'));
    console.log('    $ upass init dwqs/vue-startup my-project');
    console.log();
});

function help () {
    program.parse(process.argv);
    if (program.args.length < 1) {
        return program.help();
    }
}

help();


process.on('exit', () => console.log());

let projectDirName = program.args[0];
let template = projectDirName;
if(!projectDirName || /^\w:\/?$/.test(projectDirName)) {
    projectDirName = '.'
}

let origin = program.args[2];
let projectName = projectDirName === '.' ? path.relative('../', process.cwd()) : projectDirName;
let projectDirPath = path.resolve(projectDirName || '.');
let clone = program.clone || false;
let hasSlash = projectName;
let preProjectName = projectName;
if(!hasSlash){
    return program.help();
}

if(utils.isExist(projectDirPath)){
    inquirer.prompt([{
        type: 'confirm',
        message: projectDirName === '.'
            ? 'Generate project in current directory?'
            : 'Target directory exists. Continue?',
        name: 'ok'
    }]).then((answers) => {
        if(answers.ok){
            console.log();
            go();
        }
    });
} else {    
    let normalizeName = '';
    let index = projectName.indexOf('/');
    if(normalizeName && normalizeName !== projectName){
        inquirer.prompt([{
            type: 'confirm',
            message: `Your project's name will be created as ${normalizeName}`,
            name: 'ok'
        }]).then((answers) => {
            if(answers.ok){
                console.log();
                projectName = normalizeName;
                go();
            }
            return;
        });
    } else {
        go();
    }
}

function go(){
    let isLocalTemplate = utils.isLocalTemplate(projectName);
    console.log(projectName);
    if(isLocalTemplate){
        let templatePath = path.normalize(path.join(process.cwd(), template));
        if(utils.isExist(templatePath)){
            generate(projectName,templatePath,projectDirPath, (err,msg = "") => {
                if(err){
                    console.log(chalk.red(`Generated error: ${err.message.trim()}`));
                }
            });
        } else {
            console.log();
            console.log(chalk.red(`Local template ${template} not found.`));
            process.exit(1);
        }
    } else  {
        let arr = template.split(path.sep);
        
        if(arr.length < 1 || !arr[0]){
            return program.help();
        }              
        downloadAndGenerate(template);
    }
    
}

function downloadAndGenerate (template){
    let tmp = os.tmpdir() + '/upass-cli-template-' + uuidV1();
    let spinner = ora({
        text:`start downloading template: ${template}`,
        color:"blue"
    }).start();
    //gitlab.beisencorp.com:ux-cnpm/ux-m-upaas-ui
    //SxhFs/test-cli
    download('gitlab.beisencorp.com:ux-cnpm/ux-m-upaas-ui',tmp,{ clone: true }, (err) => {
        process.on('exit', () => rm(tmp));

        if(err){
            spinner.text = chalk.red(`Failed to download template ${template}: ${err.message.trim()}`);
            spinner.fail();
            process.exit(1);
        }
        spinner.text = chalk.green(`${template} downloaded success`);
        spinner.succeed();
        console.log();

        generate(projectName,tmp,projectDirPath, (err,msg = "") => {
            if(err){
                console.log(chalk.red(`Generated error: ${err.message.trim()}`));
            }
        });
    });
}