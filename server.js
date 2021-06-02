//Install express server
const express = require('express');
const path = require('path');

const app = express();

//Intercept requests to '/api' and return the url of the webservice endpoint.
app.get('/api', function (req, res, next) {

  let url = process.env.WEBSERVICE_ENDPOINT;
  if(url){
    console.log('Using webservice endpoint of ' + url);
  }else{
    url = 'localhost:8080';
    console.log('Environment variable WEBSERVICE_ENDPOINT not found. Using default value of ' + url);
  }

  res.json({webservice_endpoint: url});

});

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

// Start the app by listening on the default Heroku port
let port = process.env.PORT || 4200;
console.log('Starting the app by listening to the port ' + port);
app.listen(port);
