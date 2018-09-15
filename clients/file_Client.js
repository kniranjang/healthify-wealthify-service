var fs = require('fs');

class fileClient {
    constructor() {

    }

    getAllUsers() {
        var arr = JSON.parse(fs.readFileSync('./files/users.json'));
        if (typeof arr === 'undefined') return undefined;
        arr = arr.filter(element =>
            !element.isDeleted
        );
        return arr;
    }

    getUserById(id) {
        var arr = this.getAllUsers();
        if (typeof arr === 'undefined') return undefined;
        return arr.find(element => element.id === id);
    }

    postUser(user) {
        var arr = this.getAllUsers();
        if (typeof arr === 'undefined') return undefined;
        user.id = arr.length;
        arr.push(user);
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        return user;
    }

    deleteUser(id) {
        var arr = this.getAllUsers();

        var index = arr.findIndex(element =>
            element.id === id
        );
        if (index == -1) return false;
        arr[index].isDeleted = true;
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        return true;
    }

    putUser(user, id) {
        var arr = this.getAllUsers();
        if (typeof arr === 'undefined') return undefined;
        user.id = userId;
        var index = arr.findIndex(element =>
            element.id === id
        );
        if (index == -1) return undefined;
        arr[index] = user;
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        return user;
    }
}

module.exports = fileClient;

