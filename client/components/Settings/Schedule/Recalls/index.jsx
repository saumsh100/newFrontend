import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Toggle, Grid, Header } from '../../../library';
import { Map } from 'immutable';
import styles from './styles.scss';


class Recalls extends Component {

  constructor(props) {
    super(props);
    this.canSendRecalls = this.canSendRecalls.bind(this);
  }

  componentWillMount() {
    this.setState({
      canSendRecalls: this.props.activeAccount.toJS().canSendRecalls,
    });
  }

  canSendRecalls() {
    const { activeAccount } = this.props;
    const valuesMap = Map({ canSendRecalls: !this.state.canSendRecalls });
    const modifiedAccount = activeAccount.merge(valuesMap);

    const alert = {
      success: {
        body: 'Updated Recalls',
      },
      error: {
        title: 'Clinic Recalls Error',
        body: 'Failed to update.',
      },
    };
    this.props.updateEntityRequest({ key: 'accounts', model: modifiedAccount, alert });
    this.setState({
      canSendRecalls: !this.state.canSendRecalls,
    });
  }

  render() {

    return (
      <Grid>
        <Header title={'Recalls'} className={styles.headerTitle} />
        <div className={styles.toggle}>
        Recalls ON/OFF:&nbsp;
          <Toggle
            name="canSendRecalls"
            onChange={this.canSendRecalls}
            checked={this.state.canSendRecalls}
          />
        </div>
      </Grid>
    );
  }
}

Recalls.propTypes = {
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

export default enhance(Recalls);
