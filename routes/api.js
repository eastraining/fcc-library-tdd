/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const DB = process.env['MONGO_URI'];

module.exports = function (app) {

  mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });
  const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String]
  });
  let BookModel = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      BookModel.find({}, function(err, doc) {
        if (err) {
          console.log(`Cannot GET book array: ${err}`);
        } else {
          if (!doc) {
            console.log(`Cannot GET book array: ${err}`);
          } else {
            let books = [];
            doc.map(book => {
              let returnBook = {
                title: book.title,
                _id: book._id,
                commentcount: book.comments.length
              }
              books.push(returnBook);
            });
            res.json(books);  
          }
        }
      });
    })
    
    .post(function (req, res){
      let newBook; 
      if (req.body.title) {
        newBook = new BookModel({ title: req.body.title });
      } else {
        res.send('missing required field title');
        return;
      }
      if (req.body.comment) {
        if (Array.isArray(req.body.comment)) {
          newBook.comments.push(...req.body.comment);
        } else {
          newBook.comments.push(req.body.comment);
        }
      }
      newBook.save(function(err, doc) {
        if (err) {
          console.log(`Cannot save new book: ${err}`);
        } else {
          res.json(doc);
        }
      });
    })
    
    .delete(function(req, res){
      BookModel.deleteMany({}, function(err, doc) {
        if (err) {
          console.log(`Cannot delete docs from collection: ${err}`);
        } else {
          res.send('complete delete successful');
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findById(bookid, function(err, doc) {
        if (err) {
          res.send('no book exists');
        } else {
          if (!doc) {
            res.send('no book exists');
          } else {
            res.json(doc);
          }
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment; 
      if (req.body.comment) {
        comment = req.body.comment;
      } else {
        res.send('missing required field comment');
        return;
      }
      //json res format same as .get
      BookModel.findById(bookid, function(err, doc) {
        if (err) {
          res.send('no book exists');
        } else {
          if (!doc) {
            res.send('no book exists');
          } else {
            doc.comments.push(comment);
            doc.save(function(err, doc) {
              if (err) {
                console.log(`Cannot save new book: ${err}`);
              } else {
                res.json(doc);
              }
            })
          }
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      BookModel.findByIdAndDelete(bookid, function(err, doc) {
        if (err) {
          res.send('no book exists');
        } else {
          if (!doc) {
            res.send('no book exists');
          } else {
            res.send('delete successful');
          }
        }
      })
    });
  
};
