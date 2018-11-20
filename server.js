var bodyParser = require('body-parser');
var express = require('express')
var fs= require('fs')

var app = express();


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
    run_cmd('sh', ['./deploy-self.sh'], function(text){ console.log(text) });
    res.status(200);
    res.end();

})
app.post('/gitPushEventProject/',function(req, res){

    console.log("begin deploy project-------------")
    var params = {name:"coder"};
    if (req.body.repository){
        params.name = req.body.repository.name;
        params.git_url = req.body.repository.git_url;
        params.clone_url = req.body.repository.clone_url;
        params.ssh_url = req.body.repository.ssh_url;
        console.log(params)
    }

    var project_name = params.name;
    var project_dir = "../autoRelease/" + project_name + "/.git";
    fs.exists(project_dir, function(exists){
        if (exists){
            console.log("just git pull")
            run_cmd('sh', ['./deploy-project.sh'], function(text){ console.log(text) });
        }else{
            console.log("must clone")
            run_cmd('sh', ['./deploy-new-project.sh'], function(text){ console.log(text) });
        }
    })

    res.status(200);
    res.end();

})
app.get('/', function (req, res) {
  res.send('Hello,world!')
})

app.listen(3333, () => console.log('Example app listening on port 3333!'))

