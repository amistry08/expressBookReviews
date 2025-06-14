const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios')


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!isValid(username)){
            users.push({"username":username, "password":password });
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let items = JSON.stringify(books, null, 4)
  return res.send(items);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        return res.send(book)
    }else{
        return res.send(`ISBN:${isbn} does not exists`)
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let book = Object.keys(books).filter((item)=>{
    return  books[item].author.includes(author);
  })
  let authorBooks = {}
  book.forEach(element => {
    authorBooks[element] = books[element]
  });
  if(book.length > 0){
    return res.send(authorBooks)
  }else{
      return res.send(`We dont have any books by ${author}`)
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let book = Object.keys(books).filter((item)=>{
      return  books[item].title.includes(title);
    })
    let titleBooks = {}
    book.forEach(element => {
        titleBooks[element] = books[element]
    });
    if(book.length > 0){
      return res.send(titleBooks)
    }else{
        return res.send(`We dont have any books by ${title}`)
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let reviews = books[isbn];
    if(reviews){
            return res.send(reviews.reviews)
    }else{
        return res.send(`We dont have any book by IBSN:${isbn}`)
    }
});

async function getBooksAsync(){
    try{
        const response = await axios.get('http://localhost:5000/');
        console.log("books", response.data)
    }catch(error){
        console.log("error", error)
    }
}

async function getBooksByISBNAsync(isbn){
    try{
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log("books", response.data)
    }catch(error){
        console.log("error", error)
    }
}

async function getBooksByAuthorAsync(author){
    try{
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log("books", response.data)
    }catch(error){
        console.log("error", error)
    }
}

async function getBooksByTitleAsync(title){
    try{
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log("books", response.data)
    }catch(error){
        console.log("error", error)
    }
}

getBooksAsync();
getBooksByAuthorAsync("Jane");
getBooksByISBNAsync(2);
getBooksByTitleAsync("Pride");

module.exports.general = public_users;
