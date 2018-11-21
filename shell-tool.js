/**
 * Created by Joe on 2018/11/21.
 */

require('shelljs/global');

var RELEASE_BASE_PATH = "../autoRelease/";


function test() {
    var checkDir = fs.existsSync('../autoRele/');
    console.log(checkDir);
}


function restartNPM (port){
    console.log( "Start restart  server myself")

    let installPackages = 'npm install';
    let killServer = "kill -9 $(lsof -i:" + port + "|awk '{print $2}' | tail -n 2)";
    let startNPM = 'npm start';
    exec(installPackages);
    exec(killServer);
    if (exec(startNPM).code !== 0) {
        console.log('Error: failed to restart server');
        return false;
    }else{
        console.log('successful to restart server');
        return true;
    }

}

function installNPMPackages (){
    console.log( "Start install NPM relatived packages!")
    let installPackages = 'npm install';
    let killServer = "kill -9 $(lsof -i:" + port + "|awk '{print $2}' | tail -n 2)";
    let startNPM = 'npm start';
    exec(installPackages);
    exec(killServer);
    if (exec(startNPM).code !== 0) {
        console.log('Error: failed to install NPM relatived packages');
        return false;
    }else{
        console.log('successful to install NPM relatived packages');
        return true;
    }

}

module.exports = {
    restartNPM: restartNPM,
    installPackages:installNPMPackages,
