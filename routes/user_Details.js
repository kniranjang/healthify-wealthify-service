var express = require('express');
var httpStatusCodes = require('http-status-codes');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');

/* GET users listing. */
router
    .get('/', function (req, res) {
        var arr = JSON.parse(fs.readFileSync('./files/users.json'));
        arr = arr.filter(element =>
            !element.isDeleted
        );
        res.status(httpStatusCodes.OK)
            .end(JSON.stringify(arr));

    })
    .post('/', function (req, res) {
        var arr = JSON.parse(fs.readFileSync('./files/users.json'));
        var user = req.body;
        user.id = arr.length;
        arr.push(user);
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        res.status(httpStatusCodes.OK).end(JSON.stringify(user));
    })
    .delete('/:id', function (req, res) {
        var arr = JSON.parse(fs.readFileSync('./files/users.json'));
        var userId = parseInt(req.params.id, 10);
        var index = arr.findIndex(element =>
            element.id === userId
        );
        console.log(index);
        arr[index].isDeleted = true;
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        res.status(httpStatusCodes.OK).end("Deleted");
    })
    .put('/:id', function (req, res) {
        var user = req.body;        
        var userId = parseInt(req.params.id, 10);
        var arr = JSON.parse(fs.readFileSync('./files/users.json'));   
        user.id = userId;             
        var index = arr.findIndex(element =>
            element.id === userId
        );
       arr[index] = user;
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        res.status(httpStatusCodes.OK).end("Updated");
    
    });

module.exports = router;
