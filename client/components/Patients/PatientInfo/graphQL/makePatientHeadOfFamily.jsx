import React from 'react';
import { Mutation } from '@apollo/client/react/components';
import mutation from './makePatientHeadOfFamily_Mutation';

export default (props) => <Mutation mutation={mutation} {...props} />;
