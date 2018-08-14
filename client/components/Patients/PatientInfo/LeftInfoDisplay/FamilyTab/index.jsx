
import React from 'react';
import PropTypes from 'prop-types';
import Family from '../../../Shared/Family';
import FamilyMember from '../../../Shared/FamilyMember';
import { patientUserShape } from '../../../../library/PropTypeShapes';

const FamilyTab = ({ family }) => (
  <Family
    family={family}
    render={familyMembers => familyMembers.map(familyMember => <FamilyMember {...familyMember} />)}
  />
);

FamilyTab.propTypes = {
  family: PropTypes.shape({
    id: PropTypes.string,
    head: PropTypes.shape({ accountId: PropTypes.string  }),
    members: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({
        fullName: PropTypes.string,
        age: PropTypes.number,
        patient: PropTypes.shape(patientUserShape),
        lastApp: PropTypes.string,
        nextApp: PropTypes.string,
      })),
    }),
  }),
};

FamilyTab.defaultProps = {
  family: {members: { edges: []  },},
};

export default FamilyTab;
