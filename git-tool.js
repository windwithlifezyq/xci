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

function fetch_project_src(project_name, url, branch) {

    if (!which('git')) {
        echo('Sorry, this script requires git');
    }

    var release_directory = "../autoRelease/" + project_name;
    var isExist = fs.existsSync(release_directory);

    if (isExist) {
        cd(release_directory);
        let gitResetCommand = 'git reset --hard origin/master';
        let gitPullCommand = 'git pull';

        exec(gitResetCommand);
        if (exec(gitPullCommand).code !== 0) {
            echo('Error: Git pull failed');
            return false;
        }
        //run_cmd('sh', ['./deploy-project.sh'], function(text){ console.log(text) });
    } else {
        init_release_directory();
        cd(RELEASE_BASE_PATH);
        let gitCloneCommand = 'git clone ' + url;
        if (exec(gitCloneCommand).code !== 0) {
            echo('Error: Git clone failed');
            return false
        }else{
            cd(release_directory);
        }
    }

    return true;
}
test();

module.exports = {
    fetchSourceFromGit: fetch_project_src
}