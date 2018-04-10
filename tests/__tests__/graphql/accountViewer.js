
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import schema from 'CareCruGraphQL/data/schema';
import { AccountViewer } from 'CareCruGraphQL/data/types';
import {
  seedTestUsers,
  wipeTestUsers,
  enterpriseId,
  accountId,
  superAdminPermissionId,
  superAdminPermission,
  superAdminUserId,
} from '../../util/seedTestUsers';

const context = {
  sessionData: {
    userId: superAdminUserId,
    role: superAdminPermission.role,
    permissionId: superAdminPermissionId,
    enterpriseId,
    accountId,
  },
};

describe('/graphql accountViewer', () => {
  beforeAll(async () => {
    await wipeTestUsers();
  });

  beforeEach(async () => {
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeTestUsers();
  });

  test('queries a accountViwer base on logged user', async () => {
    const query = `
    query viewer {
      accountViewer {
        id
        userId
        role
        permissionId
        accountId
        enterpriseId 
      }
    }`;

    const expected = {
      accountViewer: {
        id: toGlobalId(AccountViewer.name, ''),
        userId: context.sessionData.userId,
        role: context.sessionData.role,
        permissionId: context.sessionData.permissionId,
        accountId: context.sessionData.accountId,
        enterpriseId: context.sessionData.enterpriseId,
      },
    };

    const result = await graphql(schema, query, {}, context);
    expect(result).toEqual({ data: expected });
  });
});
