
import { connectionArgs, connectionFromArray } from 'graphql-relay';
import { resolver, defaultArgs, defaultListArgs } from 'graphql-sequelize';
import { patientType, patientConnection } from './types';
import { Patient } from 'CareCruModels';

const patientResolver = resolverOptions => resolver(Patient, resolverOptions);

export default resolverOptions => ({
  patient: {
    type: patientType,
    // for single data we just need the default sequelize args
    args: defaultArgs(Patient),
    // graphql-sequelize resolver + options from the viewer
    resolve: patientResolver(resolverOptions),
  },
  patients: {
    type: patientConnection,
    // Here we join both connection args and sequelize args as possible
    args: Object.assign(connectionArgs, defaultListArgs()),
    resolve: async (_, args) => {
      // separate sequelize args from connections args
      const { limit, order, where, offset, ...rest } = args;
      // merge sequelize args to resolverOptions from the viewer
      const options = Object.assign(resolverOptions, { limit, order, where, offset });
      // use the options on the sequelize call and the rest of the args on Relay
      const data = await Patient.findAndCountAll(options);
      return { ...connectionFromArray(data.rows, rest), totalCount: data.count };
    },
  },
});
