/**
 * @flow
 * @relayHash 74543f2b4267738ffb81073f9dccbb8f
 */

/* eslint-disable */











'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type PatientstatusEnumType = ('Active' | 'Inactive' | '%future added value');
export type PatientInfo_QueryVariables = {|
  patientId: string,
|};
export type PatientInfo_QueryResponse = {|
  +accountViewer: ?{|
    +id: string,
    +patient: ?{|
      +id: string,
      +ccId: ?string,
      +family: ?{|
        +id: string,
        +ccId: ?string,
        +head: ?{|
          +id: string,
          +ccId: ?string,
          +pmsId: ?string,
          +accountId: string,
          +avatarUrl: ?string,
          +firstName: string,
          +lastName: string,
          +birthDate: ?string,
          +lastApptDate: ?string,
          +nextApptDate: ?string,
          +dueForHygieneDate: ?string,
          +dueForRecallExamDate: ?string,
          +status: ?PatientstatusEnumType,
        |},
        +members: ?{|
          +edges: ?$ReadOnlyArray<?{|
            +node: ?{|
              +id: string,
              +ccId: ?string,
              +pmsId: ?string,
              +accountId: string,
              +avatarUrl: ?string,
              +firstName: string,
              +lastName: string,
              +birthDate: ?string,
              +lastApptDate: ?string,
              +nextApptDate: ?string,
              +dueForHygieneDate: ?string,
              +dueForRecallExamDate: ?string,
              +status: ?PatientstatusEnumType,
            |},
          |}>,
        |},
      |},
    |},
  |},
|};
*/

/*
query PatientInfo_Query(
  $patientId: String!
) {
  accountViewer {
    id
    patient(id: $patientId) {
      id
      ccId
      family {
        id
        ccId
        head {
          id
          ccId
          pmsId
          accountId
          avatarUrl
          firstName
          lastName
          birthDate
          lastApptDate
          nextApptDate
          dueForHygieneDate
          dueForRecallExamDate
          status
        }
        members(first: 2147483647) {
          edges {
            node {
              id
              ccId
              pmsId
              accountId
              avatarUrl
              firstName
              lastName
              birthDate
              lastApptDate
              nextApptDate
              dueForHygieneDate
              dueForRecallExamDate
              status
              __typename
            }
            cursor
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
}
*/

const node /*: ConcreteRequest*/ = (function() {
  var v0 = [
      {
        kind: 'LocalArgument',
        name: 'patientId',
        type: 'String!',
        defaultValue: null,
      },
    ],
    v1 = {
      kind: 'ScalarField',
      alias: null,
      name: 'id',
      args: null,
      storageKey: null,
    },
    v2 = [
      {
        kind: 'Variable',
        name: 'id',
        variableName: 'patientId',
        type: 'String',
      },
    ],
    v3 = {
      kind: 'ScalarField',
      alias: null,
      name: 'ccId',
      args: null,
      storageKey: null,
    },
    v4 = {
      kind: 'ScalarField',
      alias: null,
      name: 'lastName',
      args: null,
      storageKey: null,
    },
    v5 = {
      kind: 'ScalarField',
      alias: null,
      name: 'pmsId',
      args: null,
      storageKey: null,
    },
    v6 = {
      kind: 'ScalarField',
      alias: null,
      name: 'accountId',
      args: null,
      storageKey: null,
    },
    v7 = {
      kind: 'ScalarField',
      alias: null,
      name: 'avatarUrl',
      args: null,
      storageKey: null,
    },
    v8 = {
      kind: 'ScalarField',
      alias: null,
      name: 'firstName',
      args: null,
      storageKey: null,
    },
    v9 = {
      kind: 'ScalarField',
      alias: null,
      name: 'birthDate',
      args: null,
      storageKey: null,
    },
    v10 = {
      kind: 'ScalarField',
      alias: null,
      name: 'lastApptDate',
      args: null,
      storageKey: null,
    },
    v11 = {
      kind: 'ScalarField',
      alias: null,
      name: 'nextApptDate',
      args: null,
      storageKey: null,
    },
    v12 = {
      kind: 'ScalarField',
      alias: null,
      name: 'dueForHygieneDate',
      args: null,
      storageKey: null,
    },
    v13 = {
      kind: 'ScalarField',
      alias: null,
      name: 'dueForRecallExamDate',
      args: null,
      storageKey: null,
    },
    v14 = {
      kind: 'ScalarField',
      alias: null,
      name: 'status',
      args: null,
      storageKey: null,
    },
    v15 = {
      kind: 'LinkedField',
      alias: null,
      name: 'head',
      storageKey: null,
      args: null,
      concreteType: 'Patient',
      plural: false,
      selections: [v4, v1, v5, v6, v7, v8, v3, v9, v10, v11, v12, v13, v14],
    },
    v16 = [
      {
        kind: 'Literal',
        name: 'first',
        value: 2147483647,
        type: 'Int',
      },
    ],
    v17 = [
      {
        kind: 'LinkedField',
        alias: null,
        name: 'edges',
        storageKey: null,
        args: null,
        concreteType: 'PatientEdge',
        plural: true,
        selections: [
          {
            kind: 'LinkedField',
            alias: null,
            name: 'node',
            storageKey: null,
            args: null,
            concreteType: 'Patient',
            plural: false,
            selections: [
              v9,
              v1,
              v5,
              v6,
              v7,
              v8,
              v4,
              v3,
              v10,
              v11,
              v12,
              v13,
              v14,
              {
                kind: 'ScalarField',
                alias: null,
                name: '__typename',
                args: null,
                storageKey: null,
              },
            ],
          },
          {
            kind: 'ScalarField',
            alias: null,
            name: 'cursor',
            args: null,
            storageKey: null,
          },
        ],
      },
      {
        kind: 'LinkedField',
        alias: null,
        name: 'pageInfo',
        storageKey: null,
        args: null,
        concreteType: 'PageInfo',
        plural: false,
        selections: [
          {
            kind: 'ScalarField',
            alias: null,
            name: 'endCursor',
            args: null,
            storageKey: null,
          },
          {
            kind: 'ScalarField',
            alias: null,
            name: 'hasNextPage',
            args: null,
            storageKey: null,
          },
        ],
      },
    ];
  return {
    kind: 'Request',
    operationKind: 'query',
    name: 'PatientInfo_Query',
    id: null,
    text:
      'query PatientInfo_Query(\n  $patientId: String!\n) {\n  accountViewer {\n    id\n    patient(id: $patientId) {\n      id\n      ccId\n      family {\n        id\n        ccId\n        head {\n          id\n          ccId\n          pmsId\n          accountId\n          avatarUrl\n          firstName\n          lastName\n          birthDate\n          lastApptDate\n          nextApptDate\n          dueForHygieneDate\n          dueForRecallExamDate\n          status\n        }\n        members(first: 2147483647) {\n          edges {\n            node {\n              id\n              ccId\n              pmsId\n              accountId\n              avatarUrl\n              firstName\n              lastName\n              birthDate\n              lastApptDate\n              nextApptDate\n              dueForHygieneDate\n              dueForRecallExamDate\n              status\n              __typename\n            }\n            cursor\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n}\n',
    metadata: {
      connection: [
        {
          count: null,
          cursor: null,
          direction: 'forward',
          path: ['accountViewer', 'patient', 'family', 'members'],
        },
      ],
    },
    fragment: {
      kind: 'Fragment',
      name: 'PatientInfo_Query',
      type: 'Query',
      metadata: null,
      argumentDefinitions: v0,
      selections: [
        {
          kind: 'LinkedField',
          alias: null,
          name: 'accountViewer',
          storageKey: null,
          args: null,
          concreteType: 'AccountViewer',
          plural: false,
          selections: [
            v1,
            {
              kind: 'LinkedField',
              alias: null,
              name: 'patient',
              storageKey: null,
              args: v2,
              concreteType: 'Patient',
              plural: false,
              selections: [
                v1,
                v3,
                {
                  kind: 'LinkedField',
                  alias: null,
                  name: 'family',
                  storageKey: null,
                  args: null,
                  concreteType: 'Family',
                  plural: false,
                  selections: [
                    v1,
                    v3,
                    v15,
                    {
                      kind: 'LinkedField',
                      alias: 'members',
                      name: '__PatientFamily_members_connection',
                      storageKey: '__PatientFamily_members_connection(first:2147483647)',
                      args: v16,
                      concreteType: 'PatientConnection',
                      plural: false,
                      selections: v17,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    operation: {
      kind: 'Operation',
      name: 'PatientInfo_Query',
      argumentDefinitions: v0,
      selections: [
        {
          kind: 'LinkedField',
          alias: null,
          name: 'accountViewer',
          storageKey: null,
          args: null,
          concreteType: 'AccountViewer',
          plural: false,
          selections: [
            v1,
            {
              kind: 'LinkedField',
              alias: null,
              name: 'patient',
              storageKey: null,
              args: v2,
              concreteType: 'Patient',
              plural: false,
              selections: [
                v1,
                v3,
                {
                  kind: 'LinkedField',
                  alias: null,
                  name: 'family',
                  storageKey: null,
                  args: null,
                  concreteType: 'Family',
                  plural: false,
                  selections: [
                    v1,
                    v3,
                    v15,
                    {
                      kind: 'LinkedField',
                      alias: null,
                      name: 'members',
                      storageKey: 'members(first:2147483647)',
                      args: v16,
                      concreteType: 'PatientConnection',
                      plural: false,
                      selections: v17,
                    },
                    {
                      kind: 'LinkedHandle',
                      alias: null,
                      name: 'members',
                      args: v16,
                      handle: 'connection',
                      key: 'PatientFamily_members',
                      filters: ['first'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
})();
node /*: any*/.hash = '1df54e2982abbe2abaf35a763f346148';
module.exports = node;
