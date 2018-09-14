var express = require('express');
var httpStatusCodes = require('http-status-codes');
var router = express.Router();
var DataClient = require('../clients/file_Client');
var dataClient = new DataClient();


/* GET users listing. */
router
    .get('/', function (req, res) {
        var arr = dataClient.getAllUsers();
        res.status(httpStatusCodes.OK)
            .end(JSON.stringify(arr));

    })
    .get('/:id', function (req, res) {
        var user = dataClient.getUserById(req.params.id);
        res.status(httpStatusCodes.OK).end(JSON.stringify(user));
    })
    .post('/', function (req, res) {
        var user = req.body;
        user = dataClient.postUser(user);
        res.status(httpStatusCodes.OK).end(JSON.stringify(user));
    })
    .delete('/:id', function (req, res) {
        dataClient.deleteUser(req.params.id);
        res.status(httpStatusCodes.OK).end("Deleted");
    })
    .put('/:id', function (req, res) {
        var user = req.body;        
        dataClient.putUser(user, id);
        res.status(httpStatusCodes.OK).end("Updated");
    });

module.exports = router;
