
import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
  } from 'graphql';
import { resolver, defaultArgs } from 'graphql-sequelize';
import { patientType } from './types';
import { Patient } from 'CareCruModels';

const patientResolver = resolverOptions => resolver(Patient, resolverOptions);

export default resolverOptions => ({
  patients: {
    type: new GraphQLList(patientType),
    resolve: patientResolver(resolverOptions),
  },
  patient: {
    type: patientType,
    args: defaultArgs(Patient),
    resolve: patientResolver(resolverOptions),
  },
});
    
