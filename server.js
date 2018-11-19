var bodyParser = require('body-parser');
var express = require('express')
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
    //console.log(req.body);
    console.log("begin re-deploy myself-------------")
    //console.log(req.body.repository.git_url)
    //var name = req.body.repository.name;
    //var git_url = req.body.repository.git_url;
    //var clone_url = req.body.repository.clone_url;
    //var ssh_url = req.body.repository.ssh_url;
    run_cmd('sh', ['./deploy-self.sh'], function(text){ console.log(text) });
    res.status(200);
    //res.send('ok');
    res.end();

})
app.post('/gitPushEventProject/',function(req, res){

    console.log("begin deploy project-------------")
    //console.log(req.body.repository.git_url)
    var params = {};
    params.name = req.body.repository.name;
    params.git_url = req.body.repository.git_url;
    params.clone_url = req.body.repository.clone_url;
    params.ssh_url = req.body.repository.ssh_url;
    console.log(params)
    //run_cmd('sh', ['./deploy-project.sh'], function(text){ console.log(text) });
    res.status(200);
    res.end();

})
app.get('/', function (req, res) {
  res.send(`
    <html>
      <head></head>
      <body>
         <h1>hello world11111<h1>
      </body>
    </html>
  `)
})

app.listen(3333, () => console.log('Example app listening on port 3333!'))

