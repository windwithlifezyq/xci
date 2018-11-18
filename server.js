var bodyParser = require('body-parser');
var express = require('express')
var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// respond with "hello world" when a GET request is made to the homepage
app.post('/gitPushEventXCI',function(req, res){
    console.log(req.body);
    res.status(200);
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

