var fs = require('fs');

class fileClient {   
    constructor(){
        
    }

    getAllUsers() {
        var arr = JSON.parse(fs.readFileSync('./files/users.json'));
        arr = arr.filter(element =>
            !element.isDeleted
        );
        return arr;
    }

    getUserById(id) {
        var userId = parseInt(id, 10);
        var arr = getAllUsers();
        return arr.find(element => element.id === userId);
    }

    postUser(user) {
        var arr = this.getAllUsers();
        user.id = arr.length;
        arr.push(user);
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        return user;
    }

    deleteUser(id) {
        var arr = this.getAllUsers();
        var userId = parseInt(id, 10);
        var index = arr.findIndex(element =>
            element.id === userId
        );
        arr[index].isDeleted = true;
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
    }

    putUser(user, id) {
        var userId = parseInt(id, 10);
        var arr = this.getAllUsers();
        user.id = userId;
        var index = arr.findIndex(element =>
            element.id === userId
        );
        arr[index] = user;
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
    }
}

module.exports = fileClient;

