const r = require('rethinkdb');
const globals = require('../../../../server/config/globals');
const dbConfig = globals.db;

function clearTestTables() {
  r.connect(dbConfig, (err, conn) => {
    if (err) throw err;
    console.log('dropTestModelTables: CONNECTED TEST FILE');
    r.db('carecru_development').table('TestModel').delete().run(conn);
  });
}

/**
 * wipe a table
 * @param tableName
 */
function deleteAllFrom(tableName) {
  const p = r.connect(dbConfig);
  return p.then((conn) => {
    console.log('dropTestModelTables: wiping test table: ', tableName);
    return r.db('carecru_development').table(tableName).delete().run(conn);
  });
}

/**
 * Return true if the table exists.
 * @param tableName
 */
function checkTable(tableName) {
  const p = r.connect(dbConfig);
  return p.then((conn) => {
    return r.db('carecru_development').tableList().contains(tableName).run(conn);
  });
}

/**
 * works
 * @param tableName to drop
 */
function dropTestModelTables(tableName) {
  const p = r.connect(dbConfig);
  return p.then((conn) => {
    console.log('dropTestModelTables: dropping test table');
    return r.db('carecru_development').tableDrop(tableName).run(conn);
  });
}

function listTables() {
  const p = r.connect(dbConfig);
  return p.then((conn) => {
    return r.db('carecru_development').tableList().run(conn);
  });
}

module.exports = {
  dropTestModelTables,
  listTables,
  deleteAllFrom,
  checkTable,
};
