const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.userName;
  const password = req.body.password;
  console.log(username, password);
  if (!username || !password) {
    return res.status(404).json({ message: "Please provide both username and password." });
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let user = req.session.authorization.username
  let review = req.body.review
  let book = books[req.params.isbn]
  if (!book) {
    return res.status(202).json({message:"invalid isbn"})
  }else{
   
    book.reviews[user] = review
    res.status(200).json({message:"review updated successfully", books:books})
  }
  
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let user = req.session.authorization.username
  let book = books[req.params.isbn]
  if (!book) {
    return res.status(202).json({message:"invalid isbn"})
  }else{
   
    delete book.reviews[user]
    res.status(200).json({message:"review successfully deleted", books:books})
  }

})




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
