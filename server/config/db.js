// todo [meta] remove all queries from this file

const r = require('rethinkdb');
const _ = require('lodash');
const globals = require('./globals');
let db = globals.db;
const fs = require('fs')

// #### Connection details

// RethinkDB database settings. Defaults can be overridden using environment variables.
const dbConfig = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015,
  db: process.env.RDB_DB || 'carecru_development',
};

/**
 * Connect to RethinkDB instance and perform a basic database setup:
 *
 * - create the `RDB_DB` database (defaults to `chat`)
 * - create tables `messages`, `cache`, `users` in this database
 */


if (globals.env === 'production') {
  const caCert = fs.readFileSync(`${globals.root}/compose_ca_cert`);
  db = Object.assign({}, db, {
    ssl: {
      ca: caCert,
    },
  });
}

module.exports.dropTable = function dropTable (tableName) {
  return r.connect(_.clone(db)).then((connection) => {
    console.log('connected')
    return r.tableDrop(tableName).run(connection)
  }).error((error) => {
    console.log('outer error')
    console.log(error)
    // process.exit(1)
  })
}


module.exports.setup = function () {
  console.log('Setting up RethinkDB connection...');
  r.connect({ host: dbConfig.host, port: dbConfig.port }, (er, connection) => {
    r.dbCreate(dbConfig.db).run(connection, (err) => {
      if (err) {
        console.log(`[DEBUG] RethinkDB database '${dbConfig.db}' already exists`);
      } else {
        console.log(`[INFO ] RethinkDB database created ${dbConfig.db}`);
      }
  
      _.each(dbConfig.tables, (primaryKey, tableName) => {
        console.log('tableName', tableName);
        r.db(dbConfig.db)
          .tableCreate(tableName, { primaryKey })
          .run(connection, (error) => {
            if (error) {
              console.log(`[DEBUG] RethinkDB table '${tableName}' already exists`);
            } else {
              console.log(`[INFO ] RethinkDB table created ${tableName}`);
            }
          });
      });
    });
  });
};

// #### Filtering results

/**
 * Find a user by email using the
 * [`filter`](http://www.rethinkdb.com/api/javascript/filter/) function.
 * We are using the simple form of `filter` accepting an object as an argument which
 * is used to perform the matching (in this case the attribute `mail` must be equal to
 * the value provided).
 *
 * We only need one result back so we use [`limit`](http://www.rethinkdb.com/api/javascript/limit/)
 * to return it (if found). The result is collected with [`next`](http://www.rethinkdb.com/api/javascript/next/)
 * and passed as an array to the callback function.
 *
 * @param {String} mail
 *    the email of the user that we search for
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Object} the user if found, `null` otherwise
 */
/*module.exports.findUserByEmail = function (mail, callback) {
  onConnect(function (err, connection) {
    logdebug("[INFO ][%s][findUserByEmail] Login {user: %s, pwd: 'you really thought I'd log it?'}", connection['_id'], mail);
    
    r.db(dbConfig.db).table('users').filter({'mail': mail}).limit(1).run(connection, function(err, cursor) {
      if(err) {
        logerror("[ERROR][%s][findUserByEmail][collect] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(err);
      }
      else {
        cursor.next(function (err, row) {
          if(err) {
            logerror("[ERROR][%s][findUserByEmail][collect] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
            callback(null, null); // no user, cursor is empty
          }
          else {
            callback(null, row);
          }
          connection.close();
        });
      }
      
    });
  });
};*/

/**
 * Every user document is assigned a unique id when created. Retrieving
 * a document by its id can be done using the
 * [`get`](http://www.rethinkdb.com/api/javascript/get/) function.
 *
 * RethinkDB will use the primary key index to fetch the result.
 *
 * @param {String} userId
 *    The ID of the user to be retrieved.
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Object} the user if found, `null` otherwise
 */
/*module.exports.findUserById = function (userId, callback) {
  onConnect((err, connection) => {
    r.db(dbConfig.db).table('users').get(userId).run(connection, (error, result) => {
      if (error) {
        callback(null, null);
      } else {
        callback(null, result);
      }
      
      connection.close();
    });
  });
};*/

// #### Retrieving chat messages

/**
 * To find the last `max_results` messages ordered by `timestamp`,
 * we are using [`table`](http://www.rethinkdb.com/api/javascript/table/) to access
 * messages in the table, then we
 * [`orderBy`](http://www.rethinkdb.com/api/javascript/order_by/) `timestamp`
 * and instruct the server to return only `max_results` using
 * [`limit`](http://www.rethinkdb.com/api/javascript/limit/).
 *
 * These operations are chained together and executed on the database. Results
 * are collected with [`toArray`](http://www.rethinkdb.com/api/javascript/toArray)
 * and passed as an array to the callback function.
 *
 *
 * @param {Number} max_results
 *    Maximum number of results to be retrieved from the db
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Array} an array of messages
 */
module.exports.getAvailabilities = function (maxResults, callback) {
  onConnect((err, connection) => {
    r.db(dbConfig.db)
      .table('availabilities')
      .limit(maxResults)
      .run(connection, (err, cursor) => {
        if (err) {
          callback(null, []);
          connection.close();
        } else {
          cursor.toArray((err, results) => {
            if (err) {
              callback(null, []);
            } else {
              callback(null, results);
            }
            
            connection.close();
          });
        }
      });
  });
};


/**
 * To save a new chat message using we are using
 * [`insert`](http://www.rethinkdb.com/api/javascript/insert/).
 *
 * An `insert` op returns an object specifying the number
 * of successfully created objects and their corresponding IDs:
 *
 * ```
 * {
 *   "inserted": 1,
 *   "errors": 0,
 *   "generated_keys": [
 *     "b3426201-9992-ab84-4a21-576719746036"
 *   ]
 * }
 * ```
 *
 * @param {Object} msg
 *    The message to be saved
 *
 * @param {Function} callback
 *    callback invoked once after the first result returned
 *
 * @returns {Boolean} `true` if the user was created, `false` otherwise
 */
module.exports.addAvailability = function (data, callback) {
  onConnect((err, connection) => {
    const availability = Object.assign({}, data, { id: r.uuid('id') });
    r.db(dbConfig.db)
      .table('availabilities')
      .insert(availability)
      .run(connection, (err, result) => {
        if (err) {
          callback(err);
        } else {
          if (result.inserted === 1) {
            console.log('availability', availability);
            console.log('data', data);
            callback(null, availability);
          } else {
            callback(null, false);
          }
        }
        
        connection.close();
      });
  });
};

module.exports.removeAvailability = function (data, callback) {
  onConnect((err, connection) => {
    r.db(dbConfig.db)
      .table('availabilities')
      .get(data.id)
      .delete()
      .run(connection, (err, result) => {
        if (err) {
          callback(err);
        } else {
          if (result.deleted === 1) {
            callback(null, data);
          } else {
            callback(null, false);
          }
        }
        
        connection.close();
      });
  });
};

/**
 * Adding a new user to database using  [`insert`](http://www.rethinkdb.com/api/javascript/insert/).
 *
 * If the document to be saved doesn't have an `id` field, RethinkDB automatically
 * generates an unique `id`. This is returned in the result object.
 *
 * @param {Object} user
 *   The user JSON object to be saved.
 *
 * @param {Function} callback
 *    callback invoked once after the first result returned
 *
 * @returns {Boolean} `true` if the user was created, `false` otherwise
 */
/*module.exports.saveUser = function (user, callback) {
  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('users').insert(user).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveUser] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(err);
      }
      else {
        if (result.inserted === 1) {
          callback(null, true);
        }
        else {
          callback(null, false);
        }
      }
      connection.close();
    });
  });
};*/

// #### Helper functions


/**
 * A wrapper function for the RethinkDB API `r.connect`
 * to keep the configuration details in a single function
 * and fail fast in case of a connection error.
 */
function onConnect(callback) {
  r.connect({ host: dbConfig.host, port: dbConfig.port }, (err, connection) => {
    connection['_id'] = Math.floor(Math.random() * 10001);
    callback(err, connection);
  });
}

// #### Connection management
//
// This application uses a new connection for each query needed to serve
// a user request. In case generating the response would require multiple
// queries, the same connection should be used for all queries.
//
// Example:
//
//     onConnect(function (err, connection)) {
//         if(err) { return callback(err); }
//
//         query1.run(connection, callback);
//         query2.run(connection, callback);
//     }
//
