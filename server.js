var bodyParser = require('body-parser');
var express = require('express')
var fs = require('fs')
var gitTools = require('./libs/git-tool');
var dockerTools = require('./libs/docker-tool');
var shellTools = require('./libs/shell-tool');
var envConfig = require('./libs/env-config');
var releaseServer = require('./libs/release');

var app = express();
console.log(new Date().toLocaleString());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/gitPushEventXCI/', function (req, res) {
    var params = { isUseOwnDockerFile: true, targetPath: './', name: "xci", lang: 'xcijs', type: 'web', label: 'latest', cloneUrl: 'https://github.com/windwithlifezyq/xci.git' };
    if (req.body.repository) {
        params.name = req.body.repository.name;
        params.gitUrl = req.body.repository.git_url;
        params.cloneUrl = req.body.repository.clone_url;
        params.sshUrl = req.body.repository.ssh_url;
        
    }
    console.log("release params is :",params);
    if(releaseServer.autoRelease(params)){
        res.send('successful to auto release!')  
    }else{
        res.send('failed to auto release!')  
    }
       
})
app.post('/gitPushEventProject/', function (req, res) {
    console.log("begin deploy project-------------")
    console.log('current directory is:' + process.cwd());

    var params = { isUseOwnDockerFile: false,targetPath: './', name: "coder", lang: 'java', type: 'server', label: '1.0', cloneUrl: 'https://github.com/windwithlife/coder.git' };
    if (req.query.name) {
        params.name = req.query.name;
    }
    if (req.query.ownDockerfile) {
        params.isUseOwnDockerFile = req.query.ownDockerfile;
    }
    if (req.query.targetPath) {
        params.targetPath = req.query.targetPath;
    }
    if (req.query.label) {
        params.label = req.query.label;
    }
    if (req.query.lang) {
        params.lang = req.query.lang;
    }
    if (req.query.type) {
        params.type = req.query.type;
    }

    if (req.body.repository) {
        params.name = req.body.repository.name;
        params.gitUrl = req.body.repository.git_url;
        params.cloneUrl = req.body.repository.clone_url;
        params.sshUrl = req.body.repository.ssh_url;
        
    }
    if (params.name == 'xci') {
        params.lang = 'xcijs';
    }
    console.log("release params is :",params);
    //res.send('begin to fetch source code.....')
    if(releaseServer.autoRelease(params)){
        res.send('successful to auto release!')  
    }else{
        res.send('failed to auto release!')  
    }
})
app.get('/', function (req, res) {
    res.send('Hello,world!')
})


app.get('/test', function (req, res) {
    //dockerTools.releasdockerTools.release2K8sCloud(params.name,params.label,params.type);
    dockerTools.release2K8sCloud("coder", "latest", "soa");

    res.send('Hello,world! test!');
})
process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});

app.listen(3333, () => console.log('Example app listening on port 3333!'))

