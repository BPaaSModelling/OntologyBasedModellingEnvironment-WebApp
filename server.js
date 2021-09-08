//Install express server
const express = require('express');
const path = require('path');

const multer = require('multer');
const fs = require('fs');

const app = express();

const storage = multer.diskStorage({
  destination:function (req,file,cb){

    if(req.body === undefined || req.body.prefix === undefined){
      console.log('No prefix defined.');
      return;
    }

    const directory = 'uploads'+'/'+req.body.prefix;

    if(fs.existsSync(directory)){

      cb(null,directory);

    }else{

      fs.mkdir(directory,function (err){

        if(err){
          console.log('Failed to create directory.');
          return;
        }else{
          cb(null,directory);
        }
      });

    }

  },
  filename:function (req,file,cb){

    name = req.body.fileName;
    console.log('Name: '+name);
    cb(null, name);
  }
});

upload = multer({storage:storage})

app.post('/upload', upload.single('image'), function (req, res,next){
  console.log('Uploading image');

  console.log('FileName: ' + req.body.fileName);
  console.log('Prefix: ' + req.body.prefix);

});


//Intercept requests to '/api' and return the url of the webservice endpoint.
app.get('/api', function (req, res, next) {

  let url = process.env.WEBSERVICE_ENDPOINT;
  if(url){
    console.log('Using webservice endpoint of ' + url);
  }else{
    console.log('Environment variable WEBSERVICE_ENDPOINT not found.');
  }

  res.json({webserviceEndpoint: url});

});

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/ontology-based-modelling-environment'));

app.get('/*', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/ontology-based-modelling-environment/index.html'));
});

// Start the app by listening on the default Heroku port
let port = process.env.PORT || 4200;
console.log('Starting the app by listening on port ' + port);
app.listen(port);
