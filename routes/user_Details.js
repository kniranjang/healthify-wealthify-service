var express = require('express');
var httpStatusCodes = require('http-status-codes');
var router = express.Router();
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();
var Validator = require('../lib/validator');
var validator = new Validator();
var jwt = require('jsonwebtoken');
var fs = require('fs');
<<<<<<< HEAD
var persistence = require('./persistence');
=======
>>>>>>> e93a233a77a55760eb296687b652a0ecb24f1ae7


/* GET users listing. */
router
    .get('/', function (req, res) {
<<<<<<< HEAD
        persistence.queryCollection()
            .then((arr) => {
                if (typeof arr !== 'undefined' && arr.length > 0) {
                    console.log("TEst3");
                    res.status(httpStatusCodes.OK)
                        .end(JSON.stringify(arr));
                } else
                    res.status(httpStatusCodes.NOT_FOUND)
                        .end("");
            });
        //var arr = dataClient.getAllUsers();

=======
        var arr = dataClient.getAllUsers();
        if (typeof arr !== 'undefined' && arr.length > 0) {
            res.status(httpStatusCodes.OK)
                .end(JSON.stringify(arr));
        } else
            res.status(httpStatusCodes.NOT_FOUND)
                .end("");
>>>>>>> e93a233a77a55760eb296687b652a0ecb24f1ae7
    })


    // .get('/', function (req, res) {
    //     persistence.queryCollection()
    //         .then((arr) => {
    //             console.log("test3");
    //             //if (typeof arr !== 'undefined' && arr.length > 0) {
    //             console.log('test4');
    //             res.status(httpStatusCodes.OK)
    //                 .end(JSON.stringify(arr));
    //             //s }
    //         });
    // })


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
<<<<<<< HEAD
        }
        catch (err) {
            res.status(httpStatusCodes.UNAUTHORIZED).end(err);
        }
=======
        }
        catch (err) {
            res.status(httpStatusCodes.UNAUTHORIZED).end(err);
        }


>>>>>>> e93a233a77a55760eb296687b652a0ecb24f1ae7
    })

    .post('/', function (req, res) {
        var user = req.body;
        if (!validator.IsValidUser(user)[0]) {
            res.status(httpStatusCodes.BAD_REQUEST).end(validator.IsValidUser(user)[1]);
        } else {
<<<<<<< HEAD
            //user = dataClient.postUser(user);
            persistence.createUser(user)
                .then((arr) => {
                    if (typeof arr === 'undefined') {
                        res.status(httpStatusCodes.CONFLICT).end('Email already registered.');
                    } else {
                        res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                    }
                });


=======
            user = dataClient.postUser(user);
            if (typeof user === 'undefined') {
                res.status(httpStatusCodes.CONFLICT).end('Email already registered.');
            } else
                res.status(httpStatusCodes.OK).end(JSON.stringify(user));
>>>>>>> e93a233a77a55760eb296687b652a0ecb24f1ae7
        }

    })

    .delete('/:id', function (req, res) {
        var token = req.headers.authorization;
        var secret = process.env.SECRET;
<<<<<<< HEAD
        console.log("test1");
        try {
           // if (jwt.verify(token, secret) === req.params.id) {

                //var result = dataClient.deleteUser(req.params.id);

                console.log(req.params.id);
                persistence.deleteDocument(req.params.id)
                    .then((arr) => {
                        if (arr)
                            res.status(httpStatusCodes.OK).end("Deleted");
                        else
                            res.status(httpStatusCodes.NOT_FOUND).end("Not found");
                    });
            // } else {
            //     res.status(httpStatusCodes.UNAUTHORIZED).end("Unauthorized");
            // }
        } catch (err) {
            res.status(httpStatusCodes.UNAUTHORIZED).end("unauthorized");
        }
=======
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


>>>>>>> e93a233a77a55760eb296687b652a0ecb24f1ae7
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
