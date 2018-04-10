
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { Patient, Family } from 'CareCruModels';
import schema from 'CareCruGraphQL/data/schema';
import {
  seedTestUsers,
  wipeTestUsers,
  enterpriseId,
  accountId,
  superAdminPermissionId,
  superAdminPermission,
  superAdminUserId,
} from '../../util/seedTestUsers';
import {
  patient,
  family,
  familyId,
  seedTestPatients,
  wipeTestPatients,
} from '../../util/seedTestPatients';

const context = {
  sessionData: {
    userId: superAdminUserId,
    role: superAdminPermission.role,
    permissionId: superAdminPermissionId,
    enterpriseId,
    accountId,
  },
};

describe('/graphql families', () => {
  beforeAll(async () => {
    await wipeTestPatients();
    await wipeTestUsers();
  });

  beforeEach(async () => {
    await seedTestUsers();
    await seedTestPatients();
  });

  afterAll(async () => {
    await wipeTestPatients();
    await wipeTestUsers();
  });

  test('queries a list of families', async () => {
    const query = `
    query familyList {
      accountViewer {
        families {
          id
          ccId
          pmsId
          headId
        }
      }
    }`;
    const expected = {
      accountViewer: {
        families: [
          {
            id: toGlobalId(Family.name, familyId),
            ccId: family.id,
            pmsId: family.pmsId,
            headId: family.headId,
          },
        ],
      },
    };
    const result = await graphql(schema, query, null, context);
    expect(result).toEqual({ data: expected });
  });

  test('queries a family', async () => {
    const query = `
    query family {
      accountViewer {
        family(id: "${familyId}") {
          id
          ccId
          pmsId
          headId
        }
      }
    }`;
    const expected = {
      accountViewer: {
        family: {
          id: toGlobalId(Family.name, familyId),
          ccId: family.id,
          pmsId: family.pmsId,
          headId: family.headId,
        },
      },
    };
    const result = await graphql(schema, query, null, context);
    expect(result).toEqual({ data: expected });
  });

  test('queries a family with its members', async () => {
    const query = `
    query family {
      accountViewer {
        family(id: "${familyId}") {
          id
          members{
            edges{
              node{
                id
                ccId
                firstName
              }
            }
          }
        }
      }
    }`;

    const expected = {
      accountViewer: {
        family: {
          id: toGlobalId(Family.name, familyId),
          members: {
            edges: [
              {
                node: {
                  id: toGlobalId(Patient.name, patient.id),
                  ccId: patient.id,
                  firstName: patient.firstName,
                },
              },
            ],
          },
        },
      },
    };
    const result = await graphql(schema, query, null, context);
    expect(result).toEqual({ data: expected });
  });

  test('queries a family with the head member', async () => {
    const query = `
    query family {
      accountViewer {
        family(id: "${familyId}") {
          id
          head {
            id
            ccId
            firstName
          }
        }
      }
    }`;
    const expected = {
      accountViewer: {
        family: {
          id: toGlobalId(Family.name, familyId),
          head: {
            id: toGlobalId(Patient.name, patient.id),
            ccId: patient.id,
            firstName: patient.firstName,
          },
        },
      },
    };
    const result = await graphql(schema, query, null, context);
    expect(result).toEqual({ data: expected });
  });

  test('queries a family by its node', async () => {
    const query = `
    query familyRefetchQuery {
        node(id: "${toGlobalId(Family.name, familyId)}") {
          id
          ... on ${Family.name} {
            id
            ccId
            pmsId
            headId
          }
        }
      }`;

    const expected = {
      node: {
        id: toGlobalId(Family.name, familyId),
        ccId: family.id,
        pmsId: family.pmsId,
        headId: family.headId,
      },
    };
    const result = await graphql(schema, query, null, context);
    expect(result).toEqual({ data: expected });
  });

  test('adds new family', async () => {
    const mutation = `
    mutation addFamily($input: addFamilyInput!) {
      addFamilyMutation(input: $input) {
        family {
          accountId
          pmsId
          headId
        }
        clientMutationId
      }
    }`;
    const params = {
      input: {
        accountId,
        pmsId: '13',
        headId: '12',
        clientMutationId: 'carecrutest',
      },
    };
    const expected = {
      addFamilyMutation: {
        family: {
          accountId,
          pmsId: '13',
          headId: '12',
        },
        clientMutationId: 'carecrutest',
      },
    };
    const result = await graphql(schema, mutation, null, null, params);
    expect(result).toEqual({ data: expected });
  });

  test('updates a family', async () => {
    const mutation = `
    mutation updateFamily($input: updateFamilyInput!) {
      updateFamilyMutation(input: $input) {
        family {
          id
          accountId
          pmsId
        }
        clientMutationId
      }
    }`;
    const params = {
      input: {
        id: familyId,
        accountId,
        pmsId: '99',
        clientMutationId: 'carecrutest',
      },
    };
    const expected = {
      updateFamilyMutation: {
        family: {
          id: toGlobalId(Family.name, familyId),
          accountId,
          pmsId: '99',
        },
        clientMutationId: 'carecrutest',
      },
    };
    const result = await graphql(schema, mutation, null, null, params);
    expect(result).toEqual({ data: expected });
  });

  test('deletes a family', async () => {
    const mutation = `
    mutation deleteFamily($input: deleteFamilyInput!) {
      deleteFamilyMutation(input: $input) {
        clientMutationId
      }
    }`;
    const params = {
      input: {
        id: familyId,
        clientMutationId: 'carecrutest',
      },
    };
    const expected = {
      deleteFamilyMutation: {
        clientMutationId: 'carecrutest',
      },
    };
    const result = await graphql(schema, mutation, null, null, params);
    expect(result).toEqual({ data: expected });
  });
});
