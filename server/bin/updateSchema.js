
import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { buildClientSchema, introspectionQuery, printSchema } from 'graphql/utilities';
import Schema from 'CareCruGraphQL/data/schema';

const filePath = '../../graphql/data/schema';

// Save JSON of full schema introspection for Babel Relay Plugin to use
const run = async () => {
  const result = await graphql(Schema, introspectionQuery);
  if (result.errors) {
    console.error('ERROR introspecting schema: ', JSON.stringify(result.errors, null, 2));
  } else {
    const schemaString = printSchema(buildClientSchema(result.data));

    fs.writeFileSync(path.join(__dirname, `${filePath}.json`), JSON.stringify(result, null, 2));
    fs.writeFileSync(path.join(__dirname, `${filePath}.graphql`), schemaString);
    console.log('Schema created');
  }
};

run()
  .then(() => process.exit(0))
  .catch(e => console.log(e));
