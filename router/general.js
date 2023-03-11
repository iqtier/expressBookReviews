const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = async () => {
	try {
		const allBooksPromise = await Promise.resolve(books)
		if (allBooksPromise) {
			return allBooksPromise
		} else {
			return Promise.reject(new Error('No books found.'))
		}
	} catch (err) {
		console.log(err)
	}
}

const getBooksDetailsByISBN = async (isbn) => {
	try {
		const ISBNPromise = await Promise.resolve(isbn)
		if (ISBNPromise) {
			return Promise.resolve(isbn)
		} else {
			return Promise.reject(new Error('Could not retrieve ISBN Promise.'))
		}
	} catch (error) {
		console.log(error)
	}
}



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
public_users.get("/", async function (req, res) {

  res.send(await getAllBooks());
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn",async function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  const data = await getBooksDetailsByISBN(isbn)
	res.send(books[data])
});



const findByAuthor = async author => {
	try {
		if (author) {
			let booksquery = {};
			for (const [key, value] of Object.entries(books)) {
        console.log(key);
        if (books[key].author === author) {
          booksquery[key] = value;
        }
      }if (Object.keys(booksquery).length){
        return Promise.resolve(booksquery )
      }
		} else {
			return Promise.reject(
				 new Error('Could not retrieve Author Promise.')
			)
		}
	} catch (error) {
		console.log(error)
	}
}
// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here

  let author = req.params.author;
  const data = await findByAuthor(author)
  if (data){
    res.send(data)
  }else{
    res.send(`No author found for ${author}`)
  }

	
});


const findByTitle = async title => {
	try {
		if (title) {
			let booksquery = {};
			for (const [key, value] of Object.entries(books)) {
        console.log(key);
        if (books[key].title === title) {
          booksquery[key] = value;
        }
      }if (Object.keys(booksquery).length){
        return Promise.resolve(booksquery )
      }
		} else {
			return Promise.reject(
				 new Error('Could not retrieve title Promise.')
			)
		}
	} catch (error) {
		console.log(error)
	}
}

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here

  let title = req.params.title;

  const data = await findByTitle(title)
  if (data){
    res.send(data)
  }else{
    res.send(`No title found for ${title}`)
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
