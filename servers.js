/*********************************************************************************
 * ITE5315 – Assignment 1
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Mudit Khanna Student ID: N01487943 Date: 4th March 2023
 *
 *********************************************************************************/

const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");

const port = 5500;
let booksData;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

//Display the name and humber id
app.get("/", (req, res) => {
  res.send("Name : Mudit Khanna (N01487943)");
});

//Read file sync and load the json
app.get("/data", (req, res) => {
  try {
    booksData = JSON.parse(fs.readFileSync("books.json"));
    res.send("JSON data is loaded and ready!");
    console.log(booksData);
  } catch (err) {
    res.send("File not found!");
    console.log(err);
  }
});

app.get("/data/isbn/:index", (req, res) => {
  console.log(books);
  try {
    const index = req.params.index;
    if (index < 0 || index > booksData.length) {
      throw err;
    } else {
      res.send(booksData[index].isbn);
    }
  } catch (err) {
    res.send("No book found");
  }
});

app.get("/data/search/isbn", (req, res) => {
  res.send(`<form method="POST" action="/data/search/isbn">
    <input type="text" name="isbn" placeholder="Enter ISBN"/>
    <input type="submit"> 
    </form>`);
});

app.post("/data/search/isbn", (req, res) => {
  const isbn = req.body.isbn;
  const book = booksData.find((element) => element.isbn === isbn);

  if (book) {
    res.send(`
    <h2>${book.title}</h2>
    <p>Subtitle: ${book.subtitle}</p>
    <p>Author: ${book.author}</p>
    <p>Published: ${book.published}</p>
    <p>Publisher: ${book.publisher}</p>
    <p>Pages: ${book.pages}</p>
    <p>Description: ${book.description}</p>
    `);
  } else {
    res.send("No such book exists in the record");
  }
});

//Handle wrong route using middleware
app.use((req, res) => {
  res.status(404).send("The route has not been found");
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
