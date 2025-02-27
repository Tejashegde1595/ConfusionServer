const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

const imageFileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error("You can upload only image files"),false);
    }
    else
    {
        cb(null,true);
    }
}

const upload = multer({
    storage:storage,
    fileFilter:imageFileFilter
});

const uploadRouter = express.Router();
const authenticate = require('../authenticate');
uploadRouter.use(bodyParser.json());


uploadRouter.route('/').get(authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.put(authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.post(authenticate.verifyAdmin,
upload.single('imageFile'),
(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})
module.exports = uploadRouter;
