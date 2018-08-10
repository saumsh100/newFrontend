
import { connectionArgs } from 'graphql-relay';
import { defaultListArgs } from 'graphql-sequelize';
import { patientSearchesConnection } from './types';
import { connectionFromArrayWithoutSlice } from '../../util';
import { PatientSearches } from 'CareCruModels';

const Sequelize = require('sequelize');

export default resolverOptions => ({
  patientSearches: {
    type: patientSearchesConnection,
    // Here we join both connection args and sequelize args as possible
    args: Object.assign(connectionArgs, defaultListArgs()),

    resolve: async (_, args, context) => {
      // separate sequelize args from connections args
      const { limit = 10, ...rest } = args;

      const options = {
        attributes: [
          [Sequelize.fn('max', Sequelize.cast(Sequelize.col('id'), 'varchar(255)')), 'id'],
          'userId',
          'accountId',
          'patientId',
          [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'],
          [Sequelize.fn('max', Sequelize.col('updatedAt')), 'updatedAt'],
          [Sequelize.fn('max', Sequelize.col('deletedAt')), 'deletedAt'],
        ],
        where: {
          userId: context.sessionData.userId,
        },
        group: ['userId', 'accountId', 'patientId'],
        order: [[Sequelize.fn('max', Sequelize.col('createdAt')), 'DESC']],
        limit,
      };

      // merge sequelize args to resolverOptions from the viewer
      // use the options on the sequelize call and the rest of the args on Relay
      const data = await PatientSearches.findAndCountAll(
        resolverOptions.before(options, args, context),
      );
      const connectionData = connectionFromArrayWithoutSlice(data.rows, rest, {
        arrayLength: data.count,
      });

      return { ...connectionData };
    },
  },
});
