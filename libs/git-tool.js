/**
 * Created by Joe on 2018/11/21.
 */

require('shelljs/global');
var fs = require('fs')
var path= require('path')
var envConfig = require('./env-config');
//var RELEASE_BASE_PATH = envConfig.getAutoReleaseResBasePath();


function init_release_directory(projectName) {
    mkdir('-p', envConfig.releaseSourceCodePath(projectName));
}


function cloneSource(url){
    let gitCloneCommand = 'git clone ' + url;
    if (exec(gitCloneCommand).code !== 0) {
        echo('Error: Git clone failed');
        console.log('failed to gie clone project!, clone command:' + gitCloneCommand);
        return false
    }else{
        console.log('successful to gie clone project!, clone command:' + gitCloneCommand);
        return true;
    }
}
function pullSource (){
    if (!which('git')) {
        echo('Sorry, this script requires git');
        return;
    }
    let gitResetCommand = 'git reset --hard origin/master';
    let gitPullCommand = 'git pull';

    exec(gitResetCommand);
    if (exec(gitPullCommand).code !== 0) {
        echo('Error: Git pull failed');
        return false;
    }

}
function fetch_project_src(project_name, url, branch) {

    if (!which('git')) {
        echo('Sorry, this script requires git');
        return;
    }

    var release_directory = envConfig.releaseSourceCodePath(project_name);
    var isExist = fs.existsSync(release_directory);

    if (isExist) {
        cd(release_directory);
        pullSource();
        cd(envConfig.getServerRootPath());

    } else {
        init_release_directory(project_name);
        cd(envConfig.releaseSourceCodeRootPath(project_name));
        if (cloneSource(url)){
            cd(envConfig.getServerRootPath());
            //cd(release_directory);
        }else{
            cd(envConfig.getServerRootPath());
            console.log('failed to clone project:' + project_name);
            return false;
        }
    }

    return true;
}


module.exports = {
    fetchSourceFromGit: fetch_project_src,
    gitPull:pullSource,
    gitClone:cloneSource
}