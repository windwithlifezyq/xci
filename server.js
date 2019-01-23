var bodyParser = require('body-parser');
var express = require('express')
var fs= require('fs')
var gitTools = require('./libs/git-tool');
var dockerTools = require('./libs/docker-tool');
var shellTools  = require('./libs/shell-tool');
var envConfig   = require('./libs/env-config');

var app = express();
console.log(new Date().toLocaleString());
function run_cmd(cmd, args, callback) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
    child.stdout.on('end', function() { callback (resp) });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/gitPushEventXCI',function(req, res){
    shellTools.cd(envConfig.getServerRootPath());
    console.log("begin re-deploy myself-------------")
    let originDirectory = process.cwd();
    var result = gitTools.gitPull();
    if (shellTools.installPackages()){

        shellTools.restartServer()

    }else{
        console.log('failed install xci project npm dependences!');
    }
    shellTools.cd(envConfig.getServerRootPath());
    res.status(200);
    res.end();

})
app.post('/gitPushEventProject/:serverPort',function(req, res){

    //shellTools.cd(envConfig.getServerRootPath());
    console.log("begin deploy project-------------")
    console.log('current directory is:' + process.cwd());

    let originDirectory = process.cwd();
    
    var params = {targetPath:'./',name:"coder",lang:'java',type:'server',label:'v1.1.3',cloneUrl:'https://github.com/windwithlife/coder.git'};
    if(req.query.targetPath) {
        params.targetPath = req.query.targetPath;
    }
    if(req.query.lang) {
        params.lang = req.query.lang;
    }
    if(req.query.type) {
        params.type = req.query.type;
    }

    if (req.body.repository){
        params.name = req.body.repository.name;
        params.gitUrl = req.body.repository.git_url;
        params.cloneUrl = req.body.repository.clone_url;
        params.sshUrl = req.body.repository.ssh_url;
        console.log(params)
    }

    var result = gitTools.fetchSourceFromGit(params.name,params.cloneUrl,'master');
    if (result){
        if(params.name =='coder'){
            let result = dockerTools.buildServiceDockerImage(params.name,params.label,params.lang,params.type,"./files/server/simpleserver");
            if (result){
                dockerTools.release2K8sCloud(params.name,params.label,params.type);
            }else{
                console.log("failed to create service image! can't continue to deploy to k8s");
            }  
        }else{
            let result =dockerTools.buildServiceDockerImage(params.name,params.label,params.lang,params.type,params.targetPath);
            if (result){
                dockerTools.release2K8sCloud(params.name,params.label,params.type);
            }else{
                console.log("failed to create service image! can't continue to deploy to k8s");
            }  
            
        }
    }else{
        console.log('failed to process release,root case: git fetch a failure!')
    }
    //shellTools.cd(envConfig.getServerRootPath());
    res.status(200);
    res.end();

})
app.get('/', function (req, res) {
  res.send('Hello,world!')
})


app.get('/test', function (req, res) {
    //dockerTools.releasdockerTools.release2K8sCloud(params.name,params.label,params.type);
    dockerTools.release2K8sCloud("coder","latest","soa");
    
    res.send('Hello,world! test!');
})
process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});

app.listen(3333, () => console.log('Example app listening on port 3333!'))

