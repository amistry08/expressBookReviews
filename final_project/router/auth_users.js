const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { "username": "testuser", "password": "12345" }
];

const isValid = (username)=>{ //returns boolean
    let usernames = users.filter((user)=>{
        return user.username == username
    });
    if(usernames.length > 0){
        return true
    }
    return false
}


const authenticatedUser = (username,password)=>{ //returns boolean
    let validUser = users.filter((user)=>{
        return (user.username == username && user.password == password)
    })
    if(validUser.length > 0){
        return true
    }else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(isValid(username)){
    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data:password
        }, 'access',{expiresIn:1000*1000})
        req.session.authorization ={
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    }else{
        return res.status(404).json({message: "Username or password does not match"});
    }
  }else{
    return res.status(404).json({message: "Username does not exists"});
  }
});

//Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization['username'];
    let review = req.body.review;
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
            book.reviews[username] = review
            books[isbn] = {...book}
            return res.send("Review Added Successfully");
    }else{
        return res.send(`ISBN:${isbn} does not exists`);
    }
});

//Delete User review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization['username'];
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
            book.reviews[username] = ""
            books[isbn] = {...book}
            return res.send("Review Deleted Successfully");
    }else{
        return res.send(`ISBN:${isbn} does not exists`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
