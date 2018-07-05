
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { Header, CodeSnippet } from '../../../library/index';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import accountModel from '../../../../entities/models/Account';
import PreferencesForm from './PreferencesForm';
import IntervalForm from './IntervalForm';
import SettingsCard from '../../Shared/SettingsCard';
import styles from './styles.scss';

class OnlineBooking extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { activeAccount } = this.props;
    const valuesMap = Map(values);
    const modifiedAccount = activeAccount.merge(valuesMap);
    const alert = {
      success: {
        body: 'Booking Widget Preferences Updated',
      },
      error: {
        Title: 'Preferences Error',
        body: 'Booking Widget Update Failed',
      },
    };
    this.props.updateEntityRequest({
      key: 'accounts',
      model: modifiedAccount,
      alert,
    });
  }

  render() {
    const { activeAccount } = this.props;

    if (!activeAccount) {
      return null;
    }

    const location = window.location;

    const port = location.port ? `:${location.port}` : '';
    const snippet = `<script type="text/javascript" src="${location.protocol}//my.${
      location.hostname
    }${port}/widgets/${activeAccount.id}/cc.js"></script>`;

    return (
      <SettingsCard title="Online Booking" bodyClass={styles.onlineBookingBody}>
        <div className={styles.formContainer}>
          <Header title="Color Options" contentHeader />
          <PreferencesForm activeAccount={activeAccount} handleSubmit={this.handleSubmit} />
        </div>
        <div className={styles.snippetContainer}>
          <div className={styles.label}>
            HTML SNIPPET Copy and paste the snippet below into your website, at the bottom of your
            body tag.
          </div>
          <CodeSnippet codeSnippet={snippet} />
        </div>
        <div className={styles.formContainer}>
          <Header title="Interval Options" contentHeader />
          <IntervalForm activeAccount={activeAccount} handleSubmit={this.handleSubmit} />
        </div>
      </SettingsCard>
    );
  }
}

OnlineBooking.propTypes = {
  activeAccount: PropTypes.instanceOf(accountModel).isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  return activeAccount
    ? {
      activeAccount,
    }
    : {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(OnlineBooking);
