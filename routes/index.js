var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();
var httpStatusCodes = require('http-status-codes');
var jwt = require('jsonwebtoken');
var notifications = require('../clients/notifications.js');
var persistence = require('./persistence');
// var lodash = require('lodash');

/* GET home page. */
router
  .post('/login', function (req, res) {
    console.log('Login');
    var email = req.body.email;
    console.log(email);
    var password = req.body.password;
    persistence.queryCollection(email).then((arr) => {
      console.log('*********', arr);
      if (arr === true) {
        res.status(httpStatusCodes.NOT_FOUND).end("No user with that email.");
      }
      // console.log('***************',lodash.find(arr[0], { 'email': email }));
      //var user = lodash.find(arr, { 'email': email });
      //console.log(user.email);
      else {
        arr = JSON.parse(arr);
        if (typeof arr === 'undefined' || arr.length <= 0) {
          res.status(httpStatusCodes.NOT_FOUND).end("No user with that email.");
        }
        else {
          console.log(arr[0].password);
          if (arr[0].isDeleted == true) {
             res.status(httpStatusCodes.NOT_FOUND).end("No user with that email is deleted.");
          }
          if (password === arr[0].password) {
            res.status(httpStatusCodes.OK).end(JSON.stringify(arr[0]));
          } else {
            res.status(httpStatusCodes.UNAUTHORIZED).end("Invalid password");
          }
        }
      }
    });
    // arr = JSON.parse(arr);
    // if (typeof arr === 'undefined' || arr.length <= 0) {
    //   res.status(httpStatusCodes.NOT_FOUND).end("");
    // } else {
    // var user = arr.find(element => element.email === email);
    // console.log(arr);
    // var user = lodash.find(arr, { 'email': email });
    // if (typeof user === 'undefined') {
    //   res.status(httpStatusCodes.NOT_FOUND).end("No user with that email.");
    // } else {
    //   if (bcrypt.compareSync(password, user.password)) {
    //     res.status(httpStatusCodes.OK).end(user.id);
    //   } else {
    //     res.status(httpStatusCodes.UNAUTHORIZED).end("Invalid password");
    //   }
    // }
    // }


  })

  .post('/notification', function (req, res) {
    var message = req.body.message;
    var result = notifications.sendAllNotifications(message);
    if (result === "error") {
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).end();
    } else
      res.status(httpStatusCodes.OK).end();
  });

module.exports = router;
