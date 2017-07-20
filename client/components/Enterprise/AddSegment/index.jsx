
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change, reset } from 'redux-form';
import {
  fetchEntities,
  createEntityRequest,
  updateEntityRequest,
  deleteEntityRequest,
} from '../../../thunks/fetchEntities';
import styles from './styles.scss';


class AddSegment extends Component {
  render() {
    return (
      <div className={styles.formContainer} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    updateEntityRequest,
    deleteEntityRequest,
    reset,
    change,
  }, dispatch);
}


function mapStateToProps({ entities, form, auth }, { formName }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  if (!form[formName] || !activeAccount.get('unit')) {
    return {
      values: {},
      unit: 15,
    };
  }

  return {
    appFormValues: form[formName].values,
    unit: activeAccount.get('unit'),
  };
}

AddSegment.propTypes = {
  fetchEntities: PropTypes.func,
  updateEntityRequest: PropTypes.func,
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddSegment);
