/**
 * Created by Joe on 2018/11/21.
 */

require('shelljs/global');
var fs = require('fs')
var RELEASE_BASE_PATH = "../autoRelease/";


function test() {
    var checkDir = fs.existsSync('../autoRele/');
    console.log(checkDir);
}

function buildDockerImage(dockerName,envName,dockerfilePath) {
    if (dockerfilePath){
        cd(dockerfilePath)
    }
    //var isExist = fs.existsSync(release_directory);

    //if (isExist) {
        //cd(release_directory);
        let imageName = dockerName + ":" + envName
        let buldCommand = 'docker build . -f ./Dockerfile -t ' + imageName ;
        if (exec(buldCommand).code !== 0) {
            console.log('failed to build docker image:' + imageName)
        }else{
            console.log('sucessful to build image');
        }
        //exec(gitResetCommand);
    //} else {
     //  console.log('Could not find source code!!!');
    //}


}
function runDockerImage(dockerName,envName,mapPort){
    let imageName = dockerName + ":" + envName;
    let containerName = dockerName +"_" +  envName;
    let stopContainerCommand = "docker stop " + containerName;
    let removeContainerCommand = "docker rm " + containerName;
    let runCommand = "docker run -d " + imageName + "--name" +  containerName + "-p " + mapPort + ":" + mapPort;

    exec(stopContainerCommand);
    exec(removeContainerCommand);
    if (exec(runCommand).code !== 0){
        console.log('failed to run container based imageName:' + imageName);
    }

}
function buildAndRun(dockerName,envName,path,port){

    buildDockerImage(dockerName,envName,path);
    runDockerImage(dockerName,envName,port);

}

module.exports = {
    buildImage: buildDockerImage,
    runImage:runDockerImage,
    makeImageAndRun:buildAndRun
}