let DocumentDBClient = require('documentdb').DocumentClient;
let docdbUtils = require('./cosmosdb-manager');

function TaskModel(documentDBClient, databaseId, collectionId) {
this.client = documentDBClient;
this.databaseId = databaseId;
this.collectionId = collectionId;

this.database = null;
this.collection = null;
}

TaskModel.prototype = {
init: function(callback) {
    let self = this;

    docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function(err, db) {
    if (err) {
        callback(err);
    } else {
        self.database = db;
        docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function(err, coll) {
        if (err) {
            callback(err);
        } else {
            self.collection = coll;
        }
        });
    }
    });
},

find: function(querySpec, callback) {
    let self = this;

    self.client.queryDocuments(self.collection._self, querySpec).toArray(function(err, results) {
    if (err) {
        callback(err);
    } else {
        callback(null, results);
    }
    });
},

addItem: function(item, callback) {
    let self = this;

    item.date = Date.now();
    item.completed = false;

    self.client.createDocument(self.collection._self, item, function(err, doc) {
    if (err) {
        callback(err);
    } else {
        callback(null, doc);
    }
    });
},

updateItem: function(itemId, callback) {
    let self = this;

    self.getItem(itemId, function(err, doc) {
    if (err) {
        callback(err);
    } else {
        doc.completed = true;

        self.client.replaceDocument(doc._self, doc, function(err, replaced) {
        if (err) {
            callback(err);
        } else {
            callback(null, replaced);
        }
        });
    }
    });
},

getItem: function(itemId, callback) {
    let self = this;
    let querySpec = {
    query: 'SELECT * FROM root r WHERE r.id = @id',
    parameters: [{ name: '@id', value: itemId }]
    };

    self.client.queryDocuments(self.collection._self, querySpec).toArray(function(err, results) {
    if (err) {
        callback(err);
    } else {
        callback(null, results[0]);
    }
    });
}
};

module.exports = TaskModel;