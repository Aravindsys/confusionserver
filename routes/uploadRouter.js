const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
        cb(null, "public/images");
  },
  filename: (req,file,cb) => {
      cb(null, file.originalname);
  }
});

const imageFileFilter = (req,file,cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|svg|gif)$/)){
        return cb(new Error("You can upload only image files!"), null);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});
const uploadRouter = express.Router();

uploadRouter.route("/")
  .get(authenticate.verifyUser, (req,res,next) => {
      res.statusCode = 403;
      res.end("Get operation not supported");
  })
  .post(authenticate.verifyUser, upload.single("imageFile"), (req,res,next) => {
     res.statusCode = 200;
     res.setHeader("Content-Type","application/json");
     res.json(req.file);
  })
  .put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("Put operation not supported");
})
.delete(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("Delete operation not supported");
});

module.exports = uploadRouter;
