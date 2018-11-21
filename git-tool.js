/**
 * Created by Joe on 2018/11/21.
 */

require('shelljs/global');
var fs = require('fs')
var RELEASE_BASE_PATH = "../autoRelease/";


function init_release_directory() {
    mkdir('-p', RELEASE_BASE_PATH);
}
function test() {
    var checkDir = fs.existsSync('../autoRele/');
    console.log(checkDir);
}

function cloneSource(url){
    let gitCloneCommand = 'git clone ' + url;
    if (exec(gitCloneCommand).code !== 0) {
        echo('Error: Git clone failed');
        return false
    }else{
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

    var release_directory = "../autoRelease/" + project_name;
    var isExist = fs.existsSync(release_directory);

    if (isExist) {
        cd(release_directory);
        pullSource();

    } else {
        init_release_directory();
        cd(RELEASE_BASE_PATH);
        if (cloneSource(url)){
            cd(release_directory);
        }else{
            console.log('failed to clone project:' + project_name);
            return false;
        }
    }

    return true;
}
//test();

module.exports = {
    fetchSourceFromGit: fetch_project_src,
    gitPull:pullSource,
    gitClone:cloneSource
}