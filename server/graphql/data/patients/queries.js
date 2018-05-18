
import { getOffsetWithDefault } from 'graphql-relay';
import { resolver, defaultArgs } from 'graphql-sequelize';
import { patientType, patientConnection } from './types';
import { connectionFromArrayWithoutSlice, argsListWithOrder } from '../../util';
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
    args: argsListWithOrder,
    resolve: async (_, args, context) => {
      // separate sequelize args from connections args
      const { limit, order, where, offset, ...rest } = args;

      const limitDefaultValue = () => rest.first || rest.last;

      const limitValue = limit || limitDefaultValue();

      // merge sequelize args to resolverOptions from the viewer
      const options = {
        limit: limitValue,
        order,
        where,
        offset: getOffsetWithDefault(rest.after + 1, offset),
      };

      // use the options on the sequelize call and the rest of the args on Relay
      const data = await Patient.findAndCountAll(resolverOptions.before(options, args, context));
      const connectionData = connectionFromArrayWithoutSlice(data.rows, rest, {
        arrayLength: data.count,
      });
      return { ...connectionData, totalCount: data.count };
    },
  },
});
