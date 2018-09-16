var express = require('express');
var httpStatusCodes = require('http-status-codes');
var router = express.Router();
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();
var Validator = require('../lib/validator');
var validator = new Validator();
var jwt = require('jsonwebtoken');
var fs = require('fs');


/* GET users listing. */
router
    .get('/', function (req, res) {
        var arr = dataClient.getAllUsers();
        if (typeof arr !== 'undefined' && arr.length > 0) {
            res.status(httpStatusCodes.OK)
                .end(JSON.stringify(arr));
        } else
            res.status(httpStatusCodes.NOT_FOUND)
                .end("");
    })
    .get('/:id', function (req, res) {
        var token = req.headers.authorization;
        var secret = process.env.SECRET;
        try {


            if (jwt.verify(token, secret) === req.params.id) {
                {
                    var user = dataClient.getUserById(req.params.id);
                    if (typeof user !== 'undefined')
                        res.status(httpStatusCodes.OK).end(JSON.stringify(user));
                    else
                        res.status(httpStatusCodes.NOT_FOUND).end("");
                }
            } else {
                res.status(httpStatusCodes.UNAUTHORIZED).end("Unauthorized");
            }
        }
        catch (err) {
            res.status(httpStatusCodes.UNAUTHORIZED).end(err);
        }


    })
    .post('/', function (req, res) {
        var user = req.body;
        if (!validator.IsValidUser(user)[0]) {
            res.status(httpStatusCodes.BAD_REQUEST).end(validator.IsValidUser(user)[1]);
        } else {
            user = dataClient.postUser(user);
            if (typeof user === 'undefined') {
                res.status(httpStatusCodes.CONFLICT).end('Email already registered.');
            } else
                res.status(httpStatusCodes.OK).end(JSON.stringify(user));
        }

    })
    .delete('/:id', function (req, res) {
        var token = req.headers.authorization;
        var secret = process.env.SECRET;
        try {
            if (jwt.verify(token, secret) === req.params.id) {

                var result = dataClient.deleteUser(req.params.id);
                if (result)
                    res.status(httpStatusCodes.OK).end("Deleted");
                else
                    res.status(httpStatusCodes.NOT_FOUND).end("Not found");

            } else {
                res.status(httpStatusCodes.UNAUTHORIZED).end("Unauthorized");
            }
        } catch (err) {
            res.status(httpStatusCodes.UNAUTHORIZED).end(err);
        }


    })
    .put('/:id', function (req, res) {
        var token = req.headers.authorization;
        var secret = process.env.SECRET;
        try {
            if (jwt.verify(token, secret) === req.params.id) {
                var user = req.body;
                if (!validator.IsValidUser(user)[0]) {
                    res.status(httpStatusCodes.BAD_REQUEST).end(validator.IsValidUser(user)[1]);
                } else {
                    user = dataClient.putUser(user, req.params.id);
                    if (typeof user === 'undefined') {
                        res.status(httpStatusCodes.NOT_FOUND).end("User not found.")
                    } else
                        res.status(httpStatusCodes.OK).end("Updated");
                }
            } else {
                res.status(httpStatusCodes.UNAUTHORIZED).end("Unauthorized");
            }
        } catch (err) {
            res.status(httpStatusCodes.UNAUTHORIZED).end(JSON.stringify(err));
        }
    });

module.exports = router;
