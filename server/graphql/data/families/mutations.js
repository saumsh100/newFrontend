
import { GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { Family, Patient } from 'CareCruModels';
import { familyType } from './types';

/**
 * Adds a family based on arguments provided.
 * Returns the added family model
 */
const addFamilyMutation = mutationWithClientMutationId({
  name: 'addFamily',
  inputFields: attributeFields(Family, {
    exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
  }),
  outputFields: {
    family: {
      type: familyType,
      resolve: payload => Family.findById(payload.ccId),
    },
  },
  mutateAndGetPayload: async (args) => {
    const newFamily = await Family.create(args);

    return {
      ccId: newFamily.dataValues.id,
    };
  },
});

/**
 * Updates a family for the provided id in the arguments object
 * the other provided attributes will be used to update to model.
 * Returns the updated family model
 */
const updateFamilyMutation = mutationWithClientMutationId({
  name: 'updateFamily',
  inputFields: attributeFields(Family, {
    exclude: ['createdAt', 'updatedAt', 'deletedAt'],
  }),
  outputFields: {
    family: {
      type: familyType,
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: async ({ id, ...args }) =>
    await Family.findById(id).then(p => p.update(args)),
});

/**
 * Deletes a family for the provided id in the arguments object
 * Returns null
 */
const deleteFamilyMutation = mutationWithClientMutationId({
  name: 'deleteFamily',
  inputFields: attributeFields(Family, {
    only: ['id'],
  }),
  outputFields: null,
  mutateAndGetPayload: async ({ id }) =>
    await Family.findById(id).then(p => p.destroy()),
});

/**
 * Creates a new family based on the context accountId and
 * add members to it based on the arguments provided.
 * Returns the added family model
 */
const createFamilyWithMembersMutation = mutationWithClientMutationId({
  name: 'createFamilyWithMembers',
  inputFields: {
    members: {
      type: new GraphQLNonNull(GraphQLList(GraphQLString)),
    },
  },
  outputFields: {
    family: {
      type: familyType,
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: async ({ family, members }, context) => {
    const newFamily = await Family.create({
      accountId: context.sessionData.accountId,
    });

    await Patient.update(
      { familyId: newFamily.id },
      {
        where: {
          id: members,
        },
      }
    );

    return newFamily;
  },
});

export default {
  addFamilyMutation,
  updateFamilyMutation,
  deleteFamilyMutation,
  createFamilyWithMembersMutation,
};
