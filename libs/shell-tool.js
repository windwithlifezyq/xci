/**
 * Created by Joe on 2018/11/21.
 */
var envConfig = require('./env-config')
require('shelljs/global');


function restartNPM (port){
    cd(envConfig.getServerRootPath());
    console.log( "Start restart  server myself")
    let startNPM = "kill -9 $(lsof -i:" + port + "|awk '{print $2}' | tail -n 2) && npm run start";
    if (exec(startNPM).code !== 0) {
        console.log('Error: failed to restart server');
        return false;
    }else{
        console.log('successful to restart server');
        return true;
    }
}

function restartServer (){
    restartNPM(3333);
    return;
    console.log( "Restarting  server myself");
    let startCommand = 'npm restart start';
    if (exec(startCommand).code !== 0) {
        console.log('failed to restart! COMMAND:' + startCommand)
        return false;
    }else{
        console.log('sucessful to restart! COMMAND:' + startCommand)
        return true;
    }
}


function installNPMPackages (){
    console.log( "Start install NPM relatived packages!")
    let installPackages = 'npm install';

    if (exec(installPackages).code !== 0) {
        console.log('Error: failed to install NPM relatived packages');
        return false;
    }else{
        console.log('successful to install NPM relatived packages');
        return true;
    }

}
function execScript(script){
    let result = exec(script);
    if (result.code !=0){
        //console.log(result.stderr);   
        return false;
    }else{
        //console.log(result.stdout);
        return true;
    }
}
function cdDirectory(dir){
    cd(dir)
}

module.exports = {
    restartNPM: restartNPM,
    restartServer:restartServer,
    installPackages: installNPMPackages,
    execScript:execScript,
    "cd":cdDirectory
}