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

// function dropTestModelTables() {
//   r.connect(dbConfig, (err, conn) => {
//     if (err) throw err;
//     console.log('dropTestModelTables: CONNECTED TEST FILE');
//
//     r.db('carecru_development').tableDrop('TestModel').run(conn, (error, res) => {
//       if (error) throw error;
//       console.log('dropTestModelTables: ....result', res);
//     });
//   });
// }

// function dropTestModelTables() {
//   const p = r.connect(dbConfig);
//   return p.then((conn) => {
//     console.log('dropTestModelTables: dropping test table');
//     return r.db('carecru_development').tableDrop('FakeTable').run(conn);
//   });
// }

// function listTables() {
//   r.connect(dbConfig, (err, conn) => {
//     if (err) throw err;
//     console.log('listTables: CONNECTED TEST FILE');
//     r.db('carecru_development').tableList().run(conn, (error, res) => {
//       if (error) throw err;
//       console.log('listTables: table list', res);
//     });
//   });
// }

function deleteAllFrom(tableName) {
  const p = r.connect(dbConfig);
  return p.then((conn) => {
    console.log('dropTestModelTables: wiping test table');
    return r.db('carecru_development').table(tableName).delete().run(conn);
  });
}

function checkTable(tableName) {
  const p = r.connect(dbConfig);
  return p.then((conn) => {
    return r.db('carecru_development').tableList().contains(tableName).run(conn);
  });
}

// function dropTestModelTables(tableName) {
//   const p = r.connect(dbConfig);
//   return p.then((conn) => {
//     console.log('dropTestModelTables: dropping test table');
//     return r.db('carecru_development').tableDrop(tableName).run(conn);
//   });
// }

function dropTestModelTables(tableName) {
  const p = r.connect(dbConfig);
  return p.then((conn) => {
    console.log('dropTestModelTables: dropping test table');
    return r.db('carecru_development').tableDrop(tableName).run(conn);
  }).catch();
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
};
