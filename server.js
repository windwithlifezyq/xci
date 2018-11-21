var bodyParser = require('body-parser');
var express = require('express')
var fs= require('fs')
var gitTools = require('./git-tool');
var dockerTools = require('./docker-tool');

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
    console.log("begin re-deploy myself-------------")
    var result = gitTools.pullSource();
    run_cmd('sh', ['./deploy-self.sh'], function(text){ console.log(text) });
    res.status(200);
    res.end();

})
app.post('/gitPushEventProject/',function(req, res){

    console.log("begin deploy project-------------")
    var params = {name:"coder"};
    if (req.body.repository){
        params.name = req.body.repository.name;
        params.gitUrl = req.body.repository.git_url;
        params.cloneUrl = req.body.repository.clone_url;
        params.sshUrl = req.body.repository.ssh_url;
        console.log(params)
    }

    var result = gitTools.fetchSourceFromGit(params.name,params.cloneUrl,'master');
    if (result){
        let envName = "dev";
        if(params.name =='coder'){
            dockerTools.makeImageAndRun(params.name + "_web",envName,"",3000);
            dockerTools.makeImageAndRun(params.name + "_server",envName,"./files/server/simpleserver/",8080);
        }else{
            dockerTools.makeImageAndRun(params.name,envName,"./",serverPort);
        }
    }else{
        console.log('failed to process release,root case: git fetch a failure!')
    }

    res.status(200);
    res.end();

})
app.get('/', function (req, res) {
  res.send('Hello,world!')
})

app.listen(3333, () => console.log('Example app listening on port 3333!'))

