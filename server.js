const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = new express();
const { log } = require("console");

const jsonFilePath = "./userInfo.json";

let userInfo = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(__dirname));


app.get("/", (req, res) =>{
     
    res.sendFile('index.html', {root: __dirname});
});
app.get("/index", (res, req) => {
    res.sendFile("index.html", {root: __dirname});
});

app.get("/userInfo", (req, res) => {
    let data = fs.readFileSync("userInfo.json");
    let json = JSON.parse(data.toString());
    res.json(json);
});
app.post("/userInfo", (req, res) => {
    fs.readFile("userInfo.json", (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            let jsonArr = JSON.parse(data);
            jsonArr.push(req.body);
            fs.writeFile("userInfo.json", JSON.stringify(jsonArr, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error saving data');
                } else {
                    res.send('Data saved successfully');
                }
            });
        }
    });
});
app.put('/userInfo', (req, res) => {
    // Get updated data from request body
    let updatedData = req.body;

    // Read data from JSON file
    let data = JSON.parse(fs.readFileSync(jsonFilePath));

    // Update data
    let index = data.findIndex(item => item.id === updatedData.id);
    if (index !== -1) {
        data[index] = updatedData;
    }

    // Write updated data to JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));

    // Send response
    res.send('Data updated');
});


app.listen(3000, () => {
    console.log("server is up at port 3000");
});


