var fs = require('fs');
var uuid = require('uuid');
var bcryptjs = require('bcryptjs');
var salt = bcryptjs.genSaltSync(15);

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
        if (typeof arr === 'undefined' || arr.length <= 0) return undefined;
        return arr.find(element => element.id === id && !element.isDeleted);
    }

    postUser(user) {
        var arr = this.getAllUsers();
        if (typeof arr === 'undefined') arr = [];
        var item = arr.find(element => element.email === user.email);
        if (typeof item !== 'undefined') return undefined;
        var dbUser = user;
        dbUser.id = uuid();
        dbUser.password = bcryptjs.hashSync(user.password, salt);
        arr.push(dbUser);
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        delete user.password;
        return user;
    }

    deleteUser(id) {
        var arr = this.getAllUsers();
        if (typeof arr === 'undefined' || arr.length <= 0) return false;
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
        if (typeof arr === 'undefined' || arr.length <= 0) return undefined;
        var dbUser = user;
        dbUser.id = id;

        var index = arr.findIndex(element =>
            element.id === id
        );
        if (index === -1) return undefined;
        if (user.hasOwnProperty("password")) {
            dbUser.password = bcryptjs.hashSync(user.password, salt);
        } else {
            dbUser.password = arr[index].password;
        }
        arr[index] = dbUser;
        fs.writeFileSync('./files/users.json', JSON.stringify(arr));
        delete user.password;
        return user;
    }

    getAllHospitals(state) {
        var arr = JSON.parse(fs.readFileSync('./files/hospitals.json'));
        if (typeof arr === 'undefined' || arr.length <= 0) return undefined;
        if (typeof state !== 'undefined' && state !== '') arr = arr.filter(element => element.state === state);
        arr = arr.map(element => ({ id: element.id, name: element.name, latitude: element.latitude, longitude: element.longitude }));
        return arr;
    }

    getHospitalById(id) {
        var arr = JSON.parse(fs.readFileSync('./files/hospitals.json'));
        if (typeof arr === 'undefined' || arr.length <= 0) return undefined;
        var hospital = arr.find(element => element.id === id);
        return hospital;
    }
}

module.exports = fileClient;

