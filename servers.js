/*********************************************************************************
 * ITE5315 – Assignment 1
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Mudit Khanna Student ID: N01487943 Date: 4th March 2023
 *
 *********************************************************************************/

//Importing express, body parser and file system module
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

//Get method to get book based on index using params
app.get("/data/isbn/:index", (req, res) => {
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

//Method to show the isbn search form
app.get("/data/search/isbn", (req, res) => {
  res.send(`<form method="POST" action="/data/search/isbn">
    <input type="text" name="isbn" placeholder="Enter ISBN"/>
    <input type="submit"> 
    </form>`);
});

//Post method to post result for isbn search form
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

//Method to show the title search form
app.get("/data/search/title", (req, res) => {
  res.send(`<form method="POST" action="/data/search/title">
    <input type="text" name="title" placeholder="Enter Title"/>
    <input type="submit"> 
    </form>`);
});

//Method to show title search results
app.post("/data/search/title", (req, res) => {
  const title = req.body.title;
  const booksContainingTitle = [];
  let returnData = "";

  booksData.forEach((book) => {
    if (book.title.toLowerCase().includes(title.toLowerCase())) {
      booksContainingTitle.push(book);
    }
  });

  if (!booksContainingTitle.length) {
    // Check if any book with the searched title exists or not
    res.send("No books found with the given title");
  } else {
    booksContainingTitle.forEach((book) => {
      returnData += `
      <h2>${book.title}</h2>
      <p>Subtitle: ${book.subtitle}</p>
      <p>Author: ${book.author}</p>
      <hr>
      `;
    });

    res.send(returnData);
  }
});

/*
Cons of req.query() for search feature:

It can be less secure as the client can manipulate the query string to pass unexpected data.
It can become difficult to manage and validate many different query parameters, leading to complex code.

Pros of req.params for search feature:

It's more secure as the parameter values are part of the route definition and cannot be easily manipulated by the client.
It can be easier to validate and manage parameter values as there are usually fewer of them.

Cons of req.params for search feature:

It's less flexible as we need to define the route for each parameter we want to use in the search.
It doesn't handle optional parameters as elegantly as req.query()
*/

//Handle wrong route using middleware
app.use((req, res) => {
  res.status(404).send("The route has not been found");
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
