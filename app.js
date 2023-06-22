const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Progress = require("./Progress");
const fs = require("fs");

const app = express();

async function readFileAndOutputContent(filePath) {
	try {
		const data = await fs.promises.readFile(filePath, "utf8");
		return data;
	} catch (err) {
		throw err;
	}
}

function csvHandler(s) {
	let arr = s.split("\n");
	var jsonObj = [];
	var headers = arr[0].split(",");
	for (var i = 1; i < arr.length; i++) {
		var data = arr[i].split(",");
		var obj = {};
		for (var j = 0; j < data.length; j++) {
			obj[headers[j].trim()] = data[j].trim();
		}
		jsonObj.push(obj);
	}
	return JSON.stringify(jsonObj);
}

// let booksData = []
// let chaptersData = []
// let data = {}
// readFileAndOutputContent("Books.csv").then((d) => {
// 	booksData = csvHandler(d)
//     readFileAndOutputContent("Chapters.csv").then((d) => {
//         chaptersData = csvHandler(d)
//         data = {
//             books: booksData,
//             chapters: chaptersData
//         }
//         console.log(data)
//         fs.writeFile("data.json", JSON.stringify(data), (error) => {
//             if (error){
//                 console.log(error)
        
//                 throw error
//             }
//         })
//     });
// });




// fs.writeFile("data.json", JSON.stringify(data), (error) => {
//     if (error){
//         console.log(error)

//         throw error
//     }
// })



// mongoose.connect("mongodb://127.0.0.1:27017/bible-progress")

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async function (req, res) {
	res.render("index");
});



app.listen(3000, function () {
	console.log("Server running on port 3000.");
});
