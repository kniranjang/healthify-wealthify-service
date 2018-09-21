"use strict";

var documentClient = require("documentdb").DocumentClient;
var config = require("../config");
var url = require('url');

var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });

var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;
var collectionUrl2 = `${databaseUrl}/colls/Hospital`;


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
    return new Promise((resolve, reject) => {
        client.queryDocuments(
            collectionUrl,
            'SELECT * FROM HealthyWealthyCollection r where r.email = "' + document.email + '"'
        ).toArray((err, results) => {
            // var user = lodash.find(results, { 'email': email });
            if (err) {
                reject(err);
                console.log('Error');
            }
            else{
            if(results.length > 0){
                resolve(true);            
            }
            else{
                client.createDocument(collectionUrl, document, (err, created) => {
                        if (err) reject(err)
                        else {
                            resolve(created);
                            console.log("test12");
                            //res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                        }
                    });
            }
            }                                                       
    });
    //return created;
});
}



function createHospital(document) {
   // var hospitalName = document.HospitalName;
    return new Promise((resolve, reject) => {
        client.queryDocuments(
            collectionUrl2,
            'SELECT * FROM Hospital r where r["Hospital Name"] = "' + document.HospitalName + '" OR r["HospitalName"] = "' + document.HospitalName + '"'
        ).toArray((err, results) => {
            // var user = lodash.find(results, { 'email': email });
            if (err) {
                reject(err);
                console.log('Error');
            }
            else{
            if(results.length > 0){
                resolve(true);            
            }
            else{
                client.createDocument(collectionUrl2, document, (err, created) => {
                        if (err) {reject(err); console.log(err)}
                        else {
                            resolve(created);
                            console.log("test12");
                            //res.status(httpStatusCodes.OK).end(JSON.stringify(arr));
                        }
                    });
            }
            }                                                       
    });
    //return created;
});
}


/**
 * Query the collection using SQL
 */
function queryCollection(email) {
    console.log(`Querying collection through index:\n${config.collection.id}`);
    var collection = `${config.collection.id}`;
    return new Promise((resolve, reject) => {
        console.log("test1");
        client.queryDocuments(
            collectionUrl,
            'SELECT * FROM HealthyWealthyCollection r where r.email = "' + email + '"'
        ).toArray((err, results) => {
            // var user = lodash.find(results, { 'email': email });
            if (err) {
                reject(err);
                console.log('Error');
            }
            else {
                // if (results[0].isDeleted != 'undefined' && results[0].isDeleted == true) {
                //     resolve(true);
                // }
                console.log("Test2");
                //var user = lodash.find(results, { 'id': email });
                // for (var queryResult of results) {
                let resultString = JSON.stringify(results);
                // console.log(`\tQuery returned ${resultString}`);
                //}
                // console.log();
                resolve(resultString);
            }
        });
    });
    return resultString;
};

function getDocumentById(id) {
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
    console.log(`Querying collection through index:\n${config.collection.id}`);
    var collection = `${config.collection.id}`;
    return new Promise((resolve, reject) => {
        console.log("test1");
        client.queryDocuments(
            collectionUrl,
            'SELECT * FROM HealthyWealthyCollection r where r.id = "' + id + '"'
        ).toArray((err, results) => {
            // var user = lodash.find(results, { 'email': email });
            if (err) {
                reject(err);
                console.log('Error');
            }
            else {
                // if (results[0].isDeleted === true)
                //     resolve(true);
                // //console.log("Test2");
                // //var user = lodash.find(results, { 'id': email });
                // // for (var queryResult of results) {
                // else {
                    let resultString = JSON.stringify(results);
                    // console.log(`\tQuery returned ${resultString}`);
                    //}
                    // console.log();
                    resolve(resultString);
                //}

            }
        });
    });
    return resultString;
};

function getHospitalById(id) {
    //console.log(`Querying collection through index:\n${config.collection.id}`);
    //var collection = `${config.collection.id}`;
    return new Promise((resolve, reject) => {
        console.log("test1");
        client.queryDocuments(
            collectionUrl2,
            'SELECT * FROM Hospital r where r.id = "' + id + '"'
        ).toArray((err, results) => {
            // var user = lodash.find(results, { 'email': email });
            if (err) {
                reject(err);
                console.log('Error');
            }
            else {
                console.log("Test2");
                //var user = lodash.find(results, { 'id': email });
                // for (var queryResult of results) {
                let resultString = JSON.stringify(results);
                // console.log(`\tQuery returned ${resultString}`);
                //}
                // console.log();
                resolve(resultString);
            }
        });
    });
    return resultString;
};

function getAllHospitals(state) {
    //console.log(`Querying collection through index:\n${config.collection.id}`);
    //var collection = `${config.collection.id}`;
    return new Promise((resolve, reject) => {
        console.log("test1");
        var query = '';
        if (typeof state === 'undefined') {
            query = 'SELECT h["Hospital Name"], h.id, h.longitude, h.latitude FROM Hospital h'
        }
        else {
            query = 'SELECT h["Hospital Name"], h.id, h.longitude, h.latitude FROM Hospital h where h.STATE = "' + state + '"'
        }
        client.queryDocuments(
            collectionUrl2,
            query
        ).toArray((err, results) => {
            // var user = lodash.find(results, { 'email': email });
            if (err) {
                reject(err);
                console.log('Error');
            }
            else {
                console.log("Test2");
                //var user = lodash.find(results, { 'id': email });
                // for (var queryResult of results) {
                let resultString = JSON.stringify(results);
                // console.log(`\tQuery returned ${resultString}`);
                //}
                // console.log();
                resolve(resultString);
            }
        });
    });
    return resultString;
};


// function queryCollection(id) {
//     console.log("query byyy id");
//     console.log(`Querying collection through index:\n${config.collection.id}`);
//     var collection = `${config.collection.id}`;
//     // return new Promise((resolve, reject) => {
//     //     console.log("test1");
//         client.queryDocuments(
//             collectionUrl,
//             `SELECT * FROM root `
//         ).toArray((err, results) => {
//             if (err) { reject(err); console.log('test3'); }
//             else {
//                 console.log("Test2");
//                 // for (var queryResult of results) {
//                 let resultString = JSON.stringify(results);
//                 console.log(resultString)
//                 // console.log(`\tQuery returned ${resultString}`);
//                 //}
//                 console.log();
//                 resolve(results);
//             }
//         });

//     return resultString;
// };


// function deleteDocument(id) {
//     console.log(`Deleting document:\n${id}\n`);
//     let documentUrl = uriFactory.createDocumentUri(config.database.id, config.collection.id, id);
//     return new Promise((resolve, reject) => {
//         client.deleteDocument(documentUrl, (err, result) => {
//             if (err) reject(err);
//             else {
//                 resolve(result);
//             }
//         });
//     });
//     return result;
// };

/**
 * Replace the document by ID.
 */
function replaceUser(document, id) {
    console.log(document);
    console.log(id);
    let documentUrl = `${collectionUrl}/docs/${id}`;
    console.log(`Replacing document:\n${id}\n`);
    console.log(documentUrl);
    //document.children[0].grade = 6;
    //document.children[document.id] = document;
    return new Promise((resolve, reject) => {
        client.replaceDocument(documentUrl, document, (err, result) => {
            if (err) {
                reject(err);
                console.log(err);
                console.log('Got error');
            }
            else {
                console.log(result);
                resolve(JSON.stringify(result));
            }
        });
    });
};

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
    //  deleteDocument,
    replaceUser,
    getDocumentById,
    getAllHospitals,
    getHospitalById,
    createHospital,
};