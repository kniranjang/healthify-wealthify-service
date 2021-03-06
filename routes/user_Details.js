var express = require('express');
var httpStatusCodes = require('http-status-codes');
var router = express.Router();
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();
var Validator = require('../lib/validator');
var validator = new Validator();
var jwt = require('jsonwebtoken');
var fs = require('fs');
var persistence = require('./persistence');
var bcryptjs = require('bcryptjs');
var salt = bcryptjs.genSaltSync(15);



/* GET users listing. */
router
    .get('/', function (req, res) {
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

    })

    .get('/:id', function (req, res) {
        console.log("query br id");
        // var token = req.headers.authorization;
        // var secret = process.env.SECRET;
        // try {


        //     if (jwt.verify(token, secret) === req.params.id) {
        //         {
        persistence.getDocumentById(req.params.id)
            .then((arr) => {
                console.log("success");
                if (arr === true) {
                    res.status(httpStatusCodes.NOT_FOUND).end("Not found");
                }
                else {
                    arr = JSON.parse(arr);

                    //arr = JSON.parse(arr[0]);
                    if (typeof arr !== 'undefined' && arr.length > 0) {
                        res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                    }

                    else
                        res.status(httpStatusCodes.NOT_FOUND).end("Not found");
                }

            });
        //   }
        // } else {
        //     res.status(httpStatusCodes.UNAUTHORIZED).end("Unauthorized");
        // }
        // }
        // catch (err) {
        //     res.status(httpStatusCodes.UNAUTHORIZED).end(err);
        // }


    })

    .post('/', function (req, res) {
        var user = req.body;
        user.password = bcryptjs.hashSync(user.password, salt);
        if (!validator.IsValidUser(user)[0]) {
            res.status(httpStatusCodes.BAD_REQUEST).end(validator.IsValidUser(user)[1]);
        } else {
            //user = dataClient.postUser(user);
            persistence.createUser(user)
                .then((arr) => {
                    //arr = JSON.parse(arr);
                    if(arr === true){
                         res.status(httpStatusCodes.CONFLICT).end('Email already registered.');
                    }
                     else {
                        res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                    }
                });


        }

    })

    .delete('/:id', function (req, res) {
        // var token = req.headers.authorization;
        // var secret = process.env.SECRET;
        console.log("test1");
        // try {
        // if (jwt.verify(token, secret) === req.params.id) {

        //var result = dataClient.deleteUser(req.params.id);

        console.log(req.params.id);
        persistence.getDocumentById(req.params.id)
            .then((arr) => {
                arr = JSON.parse(arr);
                if (typeof arr != 'undefined' && arr.length > 0) {
                    arr[0].isDeleted = true;
                    console.log('**********************', arr[0].isDeleted);
                    persistence.replaceUser(arr[0], req.params.id)
                        .then((arr) => {

                            if (typeof arr === 'undefined' || arr.length <= 0) {
                                res.status(httpStatusCodes.NOT_FOUND).end("User not found.")
                            } else {
                                res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                            }
                        });
                }

                else
                    res.status(httpStatusCodes.NOT_FOUND).end("Not found");
            });
        // } else {
        //     res.status(httpStatusCodes.UNAUTHORIZED).end("Unauthorized");
        // }
        // } catch (err) {
        //     res.status(httpStatusCodes.UNAUTHORIZED).end("unauthorized");
        // }
    })



    .put('/:id', function (req, res) {
        // var token = req.headers.authorization;
        // var secret = process.env.SECRET;
        // try {
        //     if (jwt.verify(token, secret) === req.params.id) {

        var user = req.body;
        console.log(user);
        if (!validator.IsValidUser(user)[0]) {
            res.status(httpStatusCodes.BAD_REQUEST).end(validator.IsValidUser(user)[1]);
        } else {
            //user = dataClient.putUser(user, req.params.id);
            persistence.replaceUser(user, req.params.id)
                .then((arr) => {
                    arr = JSON.parse(arr);

                    if (typeof arr === 'undefined' || arr.length <= 0) {
                        res.status(httpStatusCodes.NOT_FOUND).end("User not found.")
                    } else {
                        res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                    }
                });

        }
    });
module.exports = router;
