const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require('fs');

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const port = 25582;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.post("/upload", fileUpload({ createParentPath: true }), filesPayloadExists, fileExtLimiter(['*']), fileSizeLimiter, (req, res) => {
    const files = req.files;
    console.log(files);

    Object.keys(files).forEach(key => {
        const filepath = path.join(__dirname, 'uploads', files[key].name)
        files[key].mv(filepath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err })
        })
    })

    return res.json({ status: "success", message: Object.keys(files).length + " files uploaded" });
});

app.post("/getUpFiles", (req, res) => {
    var list = []
    const directoryPath = path.join(__dirname, "uploads");
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log("Unable to scan directory: " + err);
            res.json({ status: "fail", message: "Server error "+err, files: "Error" });
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file);
            list.push(file)
        });
        res.json({ status: "success", message: "Files listed", files: list });
    });
});

app.post("/getDlFiles", (req, res) => {
    var list = []
    const directoryPath = path.join(__dirname, "download");
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log("Unable to scan directory: " + err);
            res.json({ status: "fail", message: "Server error "+err, files: "Error" });
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file);
            list.push(file)
        });
        res.json({ status: "success", message: "Files listed", files: list });
    });
});

app.get('/download/:file', function(req, res){
    const f = req.params.file;

    var file = __dirname + '/download/' + f;

    res.download(file);

})


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
