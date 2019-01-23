/**
 * Created by zhangyq on 2019/1/2.
 */
let path = require('path');

module.exports ={
    SERVER_ROOT_PATH:process.cwd(),
    getServerRootPath:function(){return this.SERVER_ROOT_PATH},
    getAutoReleaseResBasePath:function(){return path.join(this.SERVER_ROOT_PATH,"../autoRelease/")},
    getReleaseDockerFilePath:function(){ return path.join(this.SERVER_ROOT_PATH, './cloud-resources/dockerfiles/')},
    getDeploymentTemplatePath:function(){return path.join(this.SERVER_ROOT_PATH,'./cloud-resources/k8s/templates/')},
    getDeploymentResourcesPath:function(){return path.join(this.SERVER_ROOT_PATH,'./cloud-resources/k8s/resources/deployments/')},
    releaseSourceCodePath:function(projectName){return path.join(this.getAutoReleaseResBasePath(),projectName,"src",projectName)},
    releaseSourceCodeRootPath:function(projectName){return path.join(this.getAutoReleaseResBasePath(),projectName,"src")},
    releaseProductPath:function(projectName){return path.join(this.getAutoReleaseResBasePath(),projectName,"product")}

}
