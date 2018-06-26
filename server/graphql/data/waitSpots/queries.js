
import { getOffsetWithDefault } from 'graphql-relay';
import moment from 'moment/moment';
import { WaitSpot } from 'CareCruModels';
import { waitSpotConnection } from './types';
import { connectionFromArrayWithoutSlice, argsListWithOrder } from '../../util';

export default resolverOptions => ({
  waitSpots: {
    type: waitSpotConnection,
    // Here we join both connection args and sequelize args as possible
    args: argsListWithOrder,
    resolve: async (_, args, context) => {
      // separate sequelize args from connections args
      const {
        limit, order, where, offset, ...rest
      } = args;

      const limitDefaultValue = () => rest.first || rest.last;

      const limitValue = limit || limitDefaultValue();

      // merge sequelize args to resolverOptions from the viewer
      const options = {
        limit: limitValue,
        order,
        where: {
          ...where,
          endDate: {
            $lte: moment()
              .add(360, 'days')
              .toISOString(),
            $gte: moment().toISOString(),
          },
        },
        offset: getOffsetWithDefault(rest.after + 1, offset),
      };

      // use the options on the sequelize call and the rest of the args on Relay
      const data = await WaitSpot.findAndCountAll(resolverOptions.before(options, args, context));
      const connectionData = connectionFromArrayWithoutSlice(data.rows, rest, {
        arrayLength: data.count,
      });
      return { ...connectionData, totalCount: data.count };
    },
  },
});
