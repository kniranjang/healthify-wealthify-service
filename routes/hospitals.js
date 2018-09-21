var express = require('express');
var router = express.Router();
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();
var httpStatusCodes = require('http-status-codes');
var persistence = require('./persistence');

router
    .get('/', function (req, res) {

        persistence.getAllHospitals(req.query.state)
            .then((arr) => {
                console.log("success");
                arr = JSON.parse(arr);
                if (typeof arr === 'undefined' || arr.length <= 0) {
                    res.status(httpStatusCodes.NOT_FOUND).end("Not found");
                } else {
                    res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                }
            });

        //var arr = dataClient.getAllHospitals(req.query.state);

    })
    .get('/:id', function (req, res) {

        persistence.getHospitalById(req.params.id)
            .then((arr) => {
                console.log("success");
                arr = JSON.parse(arr);
                if (typeof arr === 'undefined' || arr.length <= 0) {
                    res.status(httpStatusCodes.NOT_FOUND).end("Not found");
                } else {
                    res.status(httpStatusCodes.OK).end(JSON.stringify(arr[0]));
                }
            });


    })
    .post('/', function (req, res) {
        var user = req.body;
        // user.password = bcryptjs.hashSync(user.password, salt);
        // if (!validator.IsValidUser(user)[0]) {
        //     res.status(httpStatusCodes.BAD_REQUEST).end(validator.IsValidUser(user)[1]);
        // } else {
            //user = dataClient.postUser(user);
            persistence.createHospital(user)
                .then((arr) => {
                    //arr = JSON.parse(arr);
                    if (arr === true) {
                        res.status(httpStatusCodes.CONFLICT).end('Hospital already exists.');
                    }
                    else {
                        res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                    }
                });


        //}

    })

module.exports = router;