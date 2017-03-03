
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OfficeHoursForm from './OfficeHoursForm';

import { updateEntityRequest } from '../../../../thunks/fetchEntities';

function OfficeHours({ activeAccount, updateEntityRequest }) {
  return (
    <div>
      <OfficeHoursForm
        account={activeAccount}
        onSubmit={(values) => {
          const modifiedAccount = account.update('officeHours', (oh) => {
            return oh;
          });

          updateEntityRequest({ key: 'accounts', model: modifiedAccount });
        }}
      />
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(
  null,
  mapDispatchToProps
);

export default enhance(OfficeHours);
