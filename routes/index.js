var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();
var httpStatusCodes = require('http-status-codes');
var jwt = require('jsonwebtoken');

/* GET home page. */
router
  .post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var arr = dataClient.getAllUsers();
    if (typeof arr === 'undefined' || arr.length <= 0) {
      res.status(httpStatusCodes.NOT_FOUND).end("");
    } else {
      var user = arr.find(element => element.email === email);
      if (typeof user === 'undefined') {
        res.status(httpStatusCodes.NOT_FOUND).end("No user with that email.");
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          res.status(httpStatusCodes.OK).end(user.id);
        } else {
          res.status(httpStatusCodes.UNAUTHORIZED).end("Invalid password");
        }
      }
    }
  });

module.exports = router;
