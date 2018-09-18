"use strict";

var documentClient = require("documentdb").DocumentClient;
var config = require("../config");
var url = require('url');

var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });

var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;

/**
 * Get the database by ID, or create if it doesn't exist.
 * @param {string} database - The database to get or create
 */
// function getDatabase() {
//     console.log(`Getting database:\n${config.database.id}\n`);

//     return new Promise((resolve, reject) => {
//         client.readDatabase(databaseUrl, (err, result) => {
//             if (err) {
//                 if (err.code == HttpStatusCodes.NOTFOUND) {
//                     client.createDatabase(config.database, (err, created) => {
//                         if (err) reject(err)
//                         else resolve(created);
//                     });
//                 } else {
//                     reject(err);
//                 }
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

// /**
//  * Get the collection by ID, or create if it doesn't exist.
//  */
// function getCollection() {
//     console.log(`Getting collection:\n${config.collection.id}\n`);

//     return new Promise((resolve, reject) => {
//         client.readCollection(collectionUrl, (err, result) => {
//             if (err) {
//                 if (err.code == HttpStatusCodes.NOTFOUND) {
//                     client.createCollection(databaseUrl, config.collection, { offerThroughput: 400 }, (err, created) => {
//                         if (err) reject(err)
//                         else resolve(created);
//                     });
//                 } else {
//                     reject(err);
//                 }
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

// /**
//  * Get the document by ID, or create if it doesn't exist.
//  * @param {function} callback - The callback function on completion
//  */
function createUser(document) {
    console.log(document.id);
    let documentUrl = `${collectionUrl}/docs/56`;
    //console.log(`Getting document:\n${document.id}\n`);

    return new Promise((resolve, reject) => {
         client.readDocument(documentUrl, (err, result) => {
             if (err) {

        if (err.code == HttpStatusCodes.NOTFOUND) {
        console.log("test11");
        client.createDocument(collectionUrl, document, (err, created) => {
            if (err) reject(err)
            else {
                resolve(created);
                console.log("test12");
            }
        });
        } else {
         reject(err);
        }
        } else {
            resolve(result);
        }
        });
    });
    return created;
};

/**
 * Query the collection using SQL
 */
function queryCollection() {
    console.log(`Querying collection through index:\n${config.collection.id}`);
    var collection = `${config.collection.id}`;
    return new Promise((resolve, reject) => {
        console.log("test1");
        client.queryDocuments(
            collectionUrl,
            'SELECT * FROM root r '
        ).toArray((err, results) => {
            if (err) reject(err)
            else {
                console.log("Test2");
                // for (var queryResult of results) {
                let resultString = JSON.stringify(results);
                console.log(`\tQuery returned ${resultString}`);
                //}
                console.log();
                resolve(results);
            }
        });
    });
    return resultString;
};


function deleteDocument(id) {
    console.log(`Deleting document:\n${id}\n`);
    let documentUrl = uriFactory.createDocumentUri(config.database.id, config.collection.id, id);
    return new Promise((resolve, reject) => {
        client.deleteDocument(documentUrl, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });
    });
    return result;
};

/**
 * Replace the document by ID.
 */
// function replaceFamilyDocument(document) {
//     let documentUrl = `${collectionUrl}/docs/${document.id}`;
//     console.log(`Replacing document:\n${document.id}\n`);
//     document.children[0].grade = 6;

//     return new Promise((resolve, reject) => {
//         client.replaceDocument(documentUrl, document, (err, result) => {
//             if (err) reject(err);
//             else {
//                 resolve(result);
//             }
//         });
//     });
// };

/**
 * Delete the document by ID.
 */
// function deleteFamilyDocument(document) {
//     let documentUrl = `${collectionUrl}/docs/${document.id}`;
//     console.log(`Deleting document:\n${document.id}\n`);

//     return new Promise((resolve, reject) => {
//         client.deleteDocument(documentUrl, (err, result) => {
//             if (err) reject(err);
//             else {
//                 resolve(result);
//             }
//         });
//     });
// };



/**
 * Cleanup the database and collection on completion
 */
// function cleanup() {
//     console.log(`Cleaning up by deleting database ${config.database.id}`);

//     return new Promise((resolve, reject) => {
//         client.deleteDatabase(databaseUrl, (err) => {
//             if (err) reject(err)
//             else resolve(null);
//         });
//     });
// }

/**
 * Exit the app with a prompt
//  * @param {message} message - The message to display
//  */
// function exit(message) {
//     console.log(message);
//     console.log('Press any key to exit');
//     process.stdin.setRawMode(true);
//     process.stdin.resume();
//     process.stdin.on('data', process.exit.bind(process, 0));
// }

// getDatabase()
//     .then(() => getCollection())
//     .then(() => getFamilyDocument(config.documents.Andersen))
//     .then(() => getFamilyDocument(config.documents.Wakefield))
//     .then(() => queryCollection())
//     .then(() => replaceFamilyDocument(config.documents.Andersen))
//     .then(() => queryCollection())
//     .then(() => deleteFamilyDocument(config.documents.Andersen))
//     .then(() => cleanup())
//     .then(() => { exit(`Completed successfully`); })
//     .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });

module.exports = {
    queryCollection,
    createUser,
    deleteDocument,
};