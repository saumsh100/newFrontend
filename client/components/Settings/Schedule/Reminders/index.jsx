import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Toggle, Grid, Header } from '../../../library';
import { Map } from 'immutable';
import styles from './styles.scss';


class Reminders extends Component {

  constructor(props) {
    super(props);
    this.canSendReminders = this.canSendReminders.bind(this);
  }

  componentWillMount() {
    this.setState({
      canSendReminders: this.props.activeAccount.toJS().canSendReminders,
    });
  }

  canSendReminders() {
    const { activeAccount } = this.props;
    const valuesMap = Map({ canSendReminders: !this.state.canSendReminders });
    const modifiedAccount = activeAccount.merge(valuesMap);

    const alert = {
      success: {
        body: 'Updated Reminders',
      },
      error: {
        title: 'Clinic Reminders Error',
        body: 'Failed to update.',
      },
    };
    this.props.updateEntityRequest({ key: 'accounts', model: modifiedAccount, alert });
    this.setState({
      canSendReminders: !this.state.canSendReminders,
    });
  }

  render() {

    return (
      <Grid>
        <Header title={'Reminders'} className={styles.headerTitle} />
        <div className={styles.toggle}>
        Sent Reminders:&nbsp;
          <Toggle
            name="canSendReminders"
            onChange={this.canSendReminders}
            checked={this.state.canSendReminders}
          />
        </div>
      </Grid>
    );
  }
}

Reminders.propTypes = {
  activeAccount: PropTypes.object,
  updateEntityRequest: PropTypes.func,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  return {
    activeAccount,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Reminders);
