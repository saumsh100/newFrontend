
import { sequelize } from 'CareCruModels';
import { relay } from 'graphql-sequelize';

const { sequelizeNodeInterface } = relay;

// Extracting node object/interface from our sequelize models.
const {
  nodeInterface,
  nodeField,
  nodeTypeMapper,
} = sequelizeNodeInterface(sequelize);

/**
 * Class Viewer to wrap the sessionData of the logged user.
 */
class Viewer {
  constructor(obj) {
    this.userId = obj.userId;
    this.role = obj.role;
    this.permissionId = obj.permissionId;
    this.enterpriseId = obj.enterpriseId;
    this.accountId = obj.accountId;
  }
}

/**
 * Just creating an specific class for each viewer so we can better mach our type.
 * By doing that we can also add specific properties for each type of viewer.
 */
class AccountViewer extends Viewer {}

export { nodeInterface, nodeField, nodeTypeMapper, AccountViewer };
