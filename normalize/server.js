const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const DataTemplateMapping = require('./function/DataTemplateMapping');
const MergeCSV = require('./function/MergeCSV');

const tf = require('@tensorflow/tfjs-node');

const app = express();
const upload = multer();
const port = process.env.PORT || 3000;


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./models/"); // here we specify the destination . in this case i specified the current directory
    },
    filename: function(req, file, cb) {
      console.log(file);
      cb(null, file.originalname);// here we specify the file saving name . in this case i specified the original file name
    }
});
  

const uploadDisk = multer({ storage: storage });
// ----------------------------------------------------
// Middleware

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
    
    next();
});

app.use(require("morgan")("dev"));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false })); 
//form-urlencoded

// for parsing multipart/form-data
// app.use(upload.array()); 

app.use('/static', express.static('public'));
app.use('/models', express.static('models'));


// ----------------------------------------------------
// Services

app.post('/template-mapping', (req, res) => {
    try {
        const t = new DataTemplateMapping();
        t.setCSVFileName(req.body.fname);
        t.mapping()
        .then((response) => {
            console.log('/template-mapping mapping response : ', response)
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log('/template-mapping mapping catch : ', err)
            res.status(400).json(err);
        });
    } catch(err) {
        console.log('/template-mapping error : ', err)
        res.status(400).json({ error:err, data:null });
    }
});

app.post('/mergecsv', (req, res) => {
    try {
        const m = new MergeCSV();
        m.merge(req.body.file_contain_name)
        .then(() => {
            res.status(200).json({ error:null, data:'success' });
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json(err);
        });
    } catch(err) {
        console.log(err)
        res.status(400).json({ error:err, data:null });
    }
});

// Specific field of upload files
const modelFileField = uploadDisk.fields([{ name: 'model.json', maxCount: 1 }, { name: 'model.weights.bin', maxCount: 1 }]);
app.post('/model', modelFileField, (req, res) => {
    res.status(200)
});

app.listen(port, () => console.log(`App listening on port ${port}...`))