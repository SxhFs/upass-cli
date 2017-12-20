
'use strict';

let fs = require('fs');
let path = require('path');
let exec = require('child_process').execSync;
module.exports = {
    isExist(tplPath){
        let p = path.normalize(tplPath);//返回规范的路径字符串
        try {
            fs.accessSync(p, fs.R_OK & fs.W_OK, (err) => {// 测试指定用户权限,fs.R_OK - 文件对于进程是否可读 ,fs.W_OK - 文件对于进程是否可写 
                if(err){
                    console.log();
                    console.log(`Permission Denied to access ${p}`);
                }
            });
            return true;
        } catch (e){
            return false;
        }
    },

    isLocalTemplate(tpl){
        let isLocal = tpl.startsWith('.') || tpl.startsWith('/') || /^\w:/.test(tpl);
        
        if(isLocal){
            return isLocal;
        } else {
            return this.isExist(path.normalize(path.join(process.cwd(), tpl)));
        }
    },

    chareBinPath(){
        try {
            let binPath = exec('which chare');
            return binPath.toString();
        } catch (e) {
            console.log(`exec which chare error: ${e.message}`);
        }
    },

};
