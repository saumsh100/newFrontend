
import React from 'react';
import { Mutation } from 'react-apollo';
import mutation from './makePatientHeadOfFamily_Mutation';

export default props => <Mutation mutation={mutation} {...props} />;
