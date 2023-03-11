const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  let userName = req.body.userName;
  let password = req.body.password;

  if (!userName || !password) {
    res.send("Please Provide both username and password");
  } else {
    const userExist = users.some((item) =>
      Object.values(item).includes(userName)
    );

    if (userExist) {
      res.send("username already exists");
    } else {
      users.push({ username: userName, password: password });
      res.send(`User: "${userName}" is successfully registered in the database`);
    }
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  console.log(isbn);
  let book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book));
  } else {
    res.send(`Can not find isbn ${isbn}`);
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let booksquery = {};
  let author = req.params.author;
  for (const [key, value] of Object.entries(books)) {
    console.log(key);
    if (books[key].author === author) {
      booksquery[key] = value;
    }
  }
  if (Object.keys(booksquery).length) {
    res.send(booksquery);
  } else {
    res.send(`Cant find any books written by ${author}`);
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let booksquery = {};
  let title = req.params.title;
  for (const [key, value] of Object.entries(books)) {
    if (books[key].title === title) {
      booksquery[key] = value;
    }
  }
  if (Object.keys(booksquery).length) {
    res.send(booksquery);
  } else {
    res.send(`Cant find any books name "${title}"`);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    res.send(book.reviews);
  } else {
    res.send(`Can not find isbn ${isbn}`);
  }
});

module.exports.general = public_users;
