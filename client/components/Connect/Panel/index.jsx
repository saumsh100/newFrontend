
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import { Link, VButton } from '../../library';
import styles from './styles.scss';

class Panel extends Component {
  constructor(props) {
    super(props);

    //this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
  }

  /*handleSettingsSubmit(values) {
    const { account, history } = this.props;
    const model = account.merge(values);
    return this.props.updateEntityRequest({ key: 'accounts', model })
      .then(() => {
        history.push('./panel');
      });
  }*/

  render() {
    // TODO: add form to change adapter, then route to panel
    const { account } = this.props;

    return (
      <div>
        <h1>Panel</h1>
      </div>
    );
  }
}

Panel.propTypes = {
  //updateReview: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, auth }) {
  // Return activeAccount model
  return {
    account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Panel));
