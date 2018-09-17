var express = require('express');
var router = express.Router();
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();
var httpStatusCodes = require('http-status-codes');

router
    .get('/', function (req, res) {
        var arr = dataClient.getAllHospitals(req.query.state);
        if (typeof arr === 'undefined' || arr.length <= 0) {
            res.status(httpStatusCodes.NOT_FOUND).end("");
        } else {
            res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
        }
    })
    .get('/:id', function (req, res) {
        var hospital = dataClient.getHospitalById(req.params.id);
        if (typeof hospital === 'undefined') {
            res.status(httpStatusCodes.NOT_FOUND).end("");
        } else {
            res.status(httpStatusCodes.OK).end(JSON.stringify(hospital));
        }
    })

module.exports = router;