
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { Patient } from 'CareCruModels';
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
  patientId,
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

describe('/graphql patients', () => {
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

  test('queries a list of patients', async () => {
    const query = `
    query patientList {
      accountViewer {
        patients {
          edges {
            node {
              id
              firstName
              lastName
            }
          }
        }
      }
    }`;

    const result = await graphql(schema, query, null, context);
    expect(result).toMatchSnapshot();
  });

  test('queries a patient', async () => {
    const query = `
    query patient {
      accountViewer {
        patient(id: "${patientId}") {
            id
            firstName
            lastName
        }
      }
    }`;
    const result = await graphql(schema, query, null, context);
    expect(result).toMatchSnapshot();
  });

  test('queries a patient with its family', async () => {
    const query = `
    query patient {
      accountViewer {
        patient(id: "${patientId}") {
            id
            firstName
            lastName
            familyId
            family {
              id
              accountId
              headId
            }
          }
        }
      }`;

    const result = await graphql(schema, query, null, context);
    expect(result).toMatchSnapshot();
  });

  test('queries a patient by its node', async () => {
    const query = `
    query patientRefetchQuery {
        node(id: "${toGlobalId(Patient.name, patientId)}") {
          id
          ... on ${Patient.name} {
            id
            firstName
            lastName
          }
        }
      }`;

    const expected = {
      node: {
        id: toGlobalId(Patient.name, patientId),
        firstName: 'Ronald',
        lastName: 'Mcdonald',
      },
    };
    const result = await graphql(schema, query, null, context);
    expect(result).toEqual({ data: expected });
  });

  test('adds new patient', async () => {
    const mutation = `
    mutation add($input: addPatientInput!) {
        addPatientMutation(input: $input) {
          patient {
            firstName
            lastName
          }
          clientMutationId
        }
      }`;
    const params = {
      input: {
        accountId,
        firstName: 'Lucas',
        lastName: 'Taliberti',
        clientMutationId: 'carecrutest',
      },
    };

    const result = await graphql(schema, mutation, null, null, params);
    expect(result).toMatchSnapshot();
  });

  test('updates a patient', async () => {
    const mutation = `
    mutation update($input: updatePatientInput!) {
        updatePatientMutation(input: $input) {
          patient {
            id
            firstName
            lastName
          }
          clientMutationId
        }
      }`;

    const params = {
      input: {
        id: patientId,
        accountId,
        firstName: 'Lucas',
        lastName: 'Sousa',
        clientMutationId: 'carecrutest',
        omitRecallIds: [],
        omitReminderIds: [],
      },
    };

    const result = await graphql(schema, mutation, null, null, params);
    expect(result).toMatchSnapshot();
  });

  test('deletes a patient', async () => {
    const mutation = `
    mutation delete($input: deletePatientInput!){
        deletePatientMutation(input: $input){
          clientMutationId
        }
      }`;
    const params = {
      input: {
        id: patientId,
        clientMutationId: 'carecrutest',
      },
    };
    const expected = { deletePatientMutation: { clientMutationId: 'carecrutest' } };
    const result = await graphql(schema, mutation, null, null, params);
    expect(result).toEqual({ data: expected });
  });
});
