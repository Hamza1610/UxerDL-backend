const path = require('path');
// Required express mongoose and BooksInfo collection
const express = require("express");
const mongoDB = require('mongoose');
const BooksInfo = require('./models/BooksInfo');
const multer = require('multer');
// creating express instance
const app = express();
const upload = multer({ dest: "uploads/" })
// middleware
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
// MongoDb connection string
const URL = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

// Method (.connect) connect to the database using the URL and asyc methods
mongoDB.connect(URL,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(4000,() => console.log("Server running on port:4000")))
    .catch((err) => console.log(err));

// GET Request 
app.get('/api/', (req, res) => {
    // Get all books info from database to display in the client
    // Find all the data in the table and sort it from the bottom
    BooksInfo.find().sort({ createdAt : -1 })
        .then((result) => {
            // send back table documents to the  client
            res.json(result)
        })
        .catch((err) => res.json({error: "Error! No book is fetch"}))

});

//  POST reequest (search document)
app.post('/api/search', (req, res) => {

    const { searchedFile } = req.body;
    console.log(req.body);
    // need to check this line no syntex like that;
    BooksInfo.find({ bookName: searchedFile })
        .then((result) => {
            res.json(result);
            console.log(result);
        })
        .catch((error) => {
            res.json(error);
            console.log(error);
        });
})
// Post request
app.post('/api/download', (req, res) => {

   console.log(req.body);
   // Find id in Database
   BooksInfo.findById(req.body)
        .then((result) => {
            
            const fileName = result.path;
            const filePath = path.join(__dirname, 'uploads', fileName);

                  
            // Set the content disposition header
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

            console.log(filePath);
            console.log(fileName);
            // Send the file
            res.sendFile(filePath, (err) => {
              if (err) {
                console.error("Error sending file:", err);
                res.status(500).send("Error sending file");
              }
            });
            console.log(result);
        })
});

// POST Request
app.post('/api/upload', upload.single('file'), async (req, res) => {

    const { bookName, bookCategory, bookDescription, UploaderName } = req.body;
    const { originalname, path } = req.file;
    // save file sent from client to 'Books' folder
    filePath = path.replace(/^uploads\\/, "");
    console.log(filePath);

    const Data = { 
        bookName: bookName,
        bookCategory: bookCategory,
        bookDescription: bookDescription,
        UploaderName: UploaderName,
        filename: originalname,
        path: filePath,
    }
    // BooksInfo instance of the mongoose sent the req.body(json format) to dabase
    const BookInfo = new BooksInfo(Data);
    // Sending BookInfo to the database
    BookInfo.save()
        .then((result) => {
            res.json(result)
        })
        .catch( (err) => console.log(err));

        console.log(Data);
        console.log(bookCategory);
   });
