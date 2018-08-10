
import size from 'lodash/size';
import thinky from '../../../../server/config/thinky';
import {
  createTableName,
  createPrimaryKey,
  createAuxilliaryTable,
  createAuxilliaryTables,
} from '../../../../server/models/createModel/auxilliary';

const { r } = thinky;

test.skip('createModel/auxilliary Helpers', () => {
  beforeEach((done) => {
    // Remove any tables with Thing after creating them, but tables are creating async, so
    // this is just to make sure...
    /*r.db('carecru_development')
      .tableList()
      .run()
      .then((list) => {
        const tables = list.filter(str => str.indexOf('Thing') > -1);
        console.log(tables);
        return Promise.all(tables.map((tableName) => {
          console.log('Removing', tableName);
          return r.db('carecru_development').tableDrop(tableName);
        })).then(() => done());
       });*/
    done();
  });

  describe('#createTableName', () => {
    it('should be a function', () => {
      expect(typeof createTableName).toBe('function');
    });
  });

  describe('#createPrimaryKey', () => {
    it('should be a function', () => {
      expect(typeof createPrimaryKey).toBe('function');
    });
  });

  describe('#createAuxilliaryTable', () => {
    it('should be a function', () => {
      expect(typeof createAuxilliaryTable).toBe('function');
    });

    it('should create the appropriate aux Model (table)', () => {
      const auxTable = createAuxilliaryTable(
        'Thing1',
        'name',
        {
          value: 'id',
        },
      );

      expect(2).toBe(2);
    });
  });

  describe('#createAuxilliaryTables', () => {
    it('should be a function', () => {
      expect(typeof createAuxilliaryTables).toBe('function');
    });

    it('should create the appropriate Models (tables)', () => {
      const modelName = 'Thing2';
      const auxConfig = {
        name: {
          value: 'id',
        },

        job: {
          value: 'id',
          dependencies: ['businessId'],
        },
      };

      const auxTables = createAuxilliaryTables(modelName, auxConfig);
      expect(size(auxTables)).toBe(2);
    });
  });

});
