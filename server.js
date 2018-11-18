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

// respond with "hello world" when a GET request is made to the homepage
app.post('/gitPushEventXCI',function(req, res){
    //console.log(req.body);
    console.log("begin--------------")
    //console.log(req.body.repository.git_url)
    //var name = req.body.repository.name;
    //var git_url = req.body.repository.git_url;
    //var clone_url = req.body.repository.clone_url;
    //var ssh_url = req.body.repository.ssh_url;
    run_cmd('sh', ['./deploy-project.sh'], function(text){ console.log(text) });
    res.status(200);
    //res.send('ok');
    res.end();

})
app.get('/', function (req, res) {
  res.send(`
    <html>
      <head></head>
      <body>
         <h1>hello world<h1>
      </body>
    </html>
  `)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

