var express = require('express');
var httpStatusCodes = require('http-status-codes');
var router = express.Router();
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();
var validator = require('../lib/validator');


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
        var userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.status(httpStatusCodes.BAD_REQUEST).end("Id should be an integer");
        } else {
            var user = dataClient.getUserById(userId);
            if (typeof user !== 'undefined')
                res.status(httpStatusCodes.OK).end(JSON.stringify(user));
            else
                res.status(httpStatusCodes.NOT_FOUND).end("");
        }

    })
    .post('/', function (req, res) {
        var user = req.body;
        if (!validator.IsValidUser(user)[0]) {
            res.status(httpStatusCodes.BAD_REQUEST).end(validator.IsValidUser(user)[1]);
        } else {
            user = dataClient.postUser(user);
            if (typeof user === 'undefined') {
                res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).end("Failed to post user");
            } else
                res.status(httpStatusCodes.OK).end(JSON.stringify(user));
        }

    })
    .delete('/:id', function (req, res) {
        var userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.status(httpStatusCodes.BAD_REQUEST).end("Id should be an integer");
        } else {
            var result = dataClient.deleteUser(userId);
            if (result)
                res.status(httpStatusCodes.OK).end("Deleted");
            else
                res.status(httpStatusCodes.NOT_FOUND).end("Not found");
        }

    })
    .put('/:id', function (req, res) {
        var userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.status(httpStatusCodes.BAD_REQUEST).end("Id should be an integer");
        } else {
            var user = req.body;
            if (!validator.IsValidUser(user)[0]) {
                res.status(httpStatusCodes.BAD_REQUEST).end(validator.IsValidUser(user)[1]);
            } else {
                user = dataClient.putUser(user, userId);
                if (typeof user === 'undefined') {
                    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).end("Failed to put user.")
                } else
                    res.status(httpStatusCodes.OK).end("Updated");
            }

        }

    });

module.exports = router;
