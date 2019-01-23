/**
 * Created by Joezhang on 2018/11/21.
 */

require('shelljs/global');
yaml = require('node-yaml');
var fs = require('fs');
var path = require('path');
var evnConfig = require('./env-config');

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

function getDockerFileByParams(lang,type) {
    let dockerFile = 'Dockerfile' + '-' + lang + '-' + type;
    return dockerFile;
}
function compileSourceCode(name,label,lang,type,dockerfilePath){
    if (dockerfilePath){
        cd(dockerfilePath)
    }
    let compileDockerFileName = "Dockerfile-" + lang + "-compile"; 
   
    let compileDockerFileSourceURL = evnConfig.getReleaseDockerFilePath() + compileDockerFileName
    console.log('Docker image build before env:' + process.cwd());
    let compileCommand = "docker build ./simpleserver -t builder-img -f " + compileDockerFileSourceURL  + " && docker create --name builder builder-img && docker cp builder:/release/ ./release/ && docker rm builder "
   
    console.log('compile command:' + compileCommand)
    let result = exec(compileCommand);
    if (result.code !== 0) {
        console.log('failed to compile  compile command:[' + compileCommand +']');   
        console.log(result.stdout); 
        return false;
    }
    return true;
}
function buildDockerImageByParams(name, label, lang, type, dockerfilePath) {

    let dockerFileName = getDockerFileByParams(lang, type);
    let imageName = getDockerImageName(name, label, type);

    let DeployDockerFileSourceURL = evnConfig.getReleaseDockerFilePath() + dockerFileName;
    console.log('Docker image build before env:' + process.cwd());

    let buildDeployCommand = 'docker build ./simpleserver -f ' + DeployDockerFileSourceURL + ' -t ' + imageName;

    console.log('Docker image build command:' + buildDeployCommand)
    console.log('Docker image build env:' + process.cwd());
    let res = exec(buildDeployCommand);
    if (res.code !== 0) {
        console.log('failed to build deployment! commandline:[' + buildDeployCommand + ']');
        console.log(res.stdout);
        return false;
    } else {
        console.log('sucessful to build deployment! commandline:[' + buildDeployCommand + ']');
        return true;
    }


}
function buildServiceDockerImage(name, label, lang, type, dockerfilePath) {

    let res = compileSourceCode(name, label, lang, type, dockerfilePath);
    if (!res) {
        console.log('failed to build deployment!');
        //console.log(res.stdout); 
        return false;
    } else {
        let result = buildDockerImageByParams(name, label, lang, type, dockerfilePath);
        if (result) {
            console.log('sucessful to build deployment! ');
            return true;
        } else {
            console.log('failed to build deployment!');
            return false;
        }

    }

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
    buildServiceDockerImage:buildServiceDockerImage,
    release2K8sCloud:release2K8sCloud
}