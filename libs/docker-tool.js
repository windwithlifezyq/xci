/**
 * Created by Joe on 2018/11/21.
 */

require('shelljs/global');
yaml = require('node-yaml');
var fs = require('fs');
var path = require('path');
var evnConfig = require('./env-config');

function test() {
    var checkDir = fs.existsSync('../autoRele/');
    console.log(checkDir);
}

function buildDockerImage(dockerName,envName,dockerfilePath) {
    if (dockerfilePath){
        cd(dockerfilePath)
    }


        let imageName = dockerName + ":" + envName
        let buldCommand = 'docker build . -f ./Dockerfile -t ' + imageName ;
        if (exec(buldCommand).code !== 0) {
            console.log('failed to build docker image:' + imageName)
        }else{
            console.log('sucessful to build image');
        }

}
function getDockerFileByParams(lang,type) {
    let dockerFile = 'Dockerfile' + '-' + lang + '-' + type;
    return dockerFile;
}
function buildServiceDockerImage(name,label,lang,type,dockerfilePath) {
    if (dockerfilePath){
        cd(dockerfilePath)
    }
    let dockerFileName = getDockerFileByParams(lang,type);
    let imageName  = getDockerImageName(name,label,type);

    let dockerFileSource = evnConfig.getReleaseDockerFilePath() + dockerFileName;
    let dockerFileDestPath = './' ;
    cp(dockerFileSource,dockerFileDestPath);

    let buldCommand = 'docker build . -f ./'+ dockerFileName +  ' -t ' + imageName ;
    console.log('Docker image build command:' + buldCommand)
    console.log('Docker image build env:' + process.cwd());
    if (exec(buldCommand).code !== 0) {
        console.log('failed to build docker image! IMAGE NAME:[' + imageName +']');    }else{
        console.log('sucessful to build image! IMAGE NAME:[' + imageName +']');
    }
}
function runDockerImage(dockerName,envName,mapPort){
    let imageName = dockerName + ":" + envName;
    let containerName = dockerName +"_" +  envName;
    let stopContainerCommand = 'docker stop ' + containerName;
    let removeContainerCommand = 'docker rm ' + containerName;
    let runCommand = 'docker run -d  --name=' +  containerName + ' -p ' + mapPort + ":" + mapPort + "  " + imageName;

    console.log(stopContainerCommand);
    console.log(removeContainerCommand);
    console.log(runCommand);
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
function getServiceName(serviceName, type){
    let imageName = "a/b:1.0.1";
    if (type){
        imageName = serviceName +'-' + type;
    }else{
        imageName = serviceName ;
    }
    return imageName;
}
function getDockerImageName(serviceName,labelName, type){
    let imageName = "a/b:1.0.1";
    imageName = getServiceName(serviceName,type) + ":" + labelName;
    return imageName;
}
function createK8sOperationFiles(serviceName,imageName){

    let currentPath = process.cwd();
    console.log(currentPath);
    let templateFilePath =evnConfig.getDeploymentTemplatePath();

    let deploymentTemplate = templateFilePath + 'deployment.yaml';
    let serviceTemplate = templateFilePath + 'service.yaml';

    let deployServiceFile = evnConfig.getDeploymentResourcesPath() +  serviceName;
     if(exec('mkdir -p ' + evnConfig.getDeploymentResourcesPath()).code !==0){
        console.log('failed to mkdir' + evnConfig.getDeploymentResourcesPath());
     }
     //if (exec(gitCloneCommand).code !== 0) 
    let tempDeployFile = deployServiceFile + "-deploy.yaml"
    let tempServiceFile = deployServiceFile + "-service.yaml"
    let finalDeploymentFileName = deployServiceFile +'-deployment.yaml';
    console.log("Deploy template:\r\n" + deploymentTemplate);



    let deploy = yaml.readSync(deploymentTemplate, {encoding: "utf8",schema: yaml.schema.defaultSafe})
    deploy.metadata.name = serviceName;
    deploy.metadata.labels.k8sApp = serviceName;
    deploy.spec.selector.matchLabels.k8sApp = serviceName;
    deploy.spec.template.metadata.name= serviceName;
    deploy.spec.template.metadata.labels.k8sApp= serviceName;
    deploy.spec.template.spec.containers[0].image= imageName;
    console.log(JSON.stringify(deploy));
    yaml.writeSync(tempDeployFile,deploy,"utf8");


    console.log("service template" + serviceTemplate);
    let service = yaml.readSync(serviceTemplate, {encoding: "utf8",schema: yaml.schema.defaultSafe})
    service.metadata.name = serviceName;
    service.metadata.labels.k8sApp = serviceName;
    service.spec.selector.k8sApp = serviceName;
    console.log(deploy);
    yaml.writeSync(tempServiceFile,service,"utf8");

    var contentTextDeployment = fs.readFileSync(tempDeployFile,'utf-8');
    var contentTextService = fs.readFileSync(tempServiceFile,'utf-8');
    var contentSplitLine = "\n---\n\n"

    rm(finalDeploymentFileName);
    rm(tempDeployFile);
    rm(tempServiceFile);

    var result = fs.appendFileSync(finalDeploymentFileName,contentTextDeployment);
    result = fs.appendFileSync(finalDeploymentFileName,contentSplitLine);
    result = fs.appendFileSync(finalDeploymentFileName,contentTextService);

    console.log("DockerImageName:" + imageName);
    return imageName;
}
function releaseService2Cloud(serviceName,imageName){

    let currentPath = process.cwd();
    console.log(currentPath);
    let deployServicePath =  evnConfig.getDeploymentResourcesPath();
    let finalDeploymentFileName = deployServicePath + serviceName +'-deployment.yaml';

    let runUnDeployCommand = 'kubectl delete -f  ' + finalDeploymentFileName;
    let runDeployCommand = 'kubectl create -f  ' + finalDeploymentFileName;

    console.log("Exec Command String:" + runDeployCommand);
    exec(runUnDeployCommand);
    if(exec(runDeployCommand).code !== 0){
        console.log('failed to release service to k8s based imageName:' + imageName);
    }else{
        console.log('sucessfule to release service to k8s cloud platform!')
    }

}

function release2K8sCloud(name,labelName,type) {
    let imageName = getDockerImageName(name,labelName,type);
    let serviceName  = getServiceName(name, type);
    createK8sOperationFiles(serviceName,imageName);
    releaseService2Cloud(serviceName,imageName);
}

module.exports = {
    buildImage: buildDockerImage,
    buildServiceDockerImage:buildServiceDockerImage,
    release2K8sCloud:release2K8sCloud
}