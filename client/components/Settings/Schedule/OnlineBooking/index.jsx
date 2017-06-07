
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { Header, CodeSnippet } from '../../../library';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import PreferencesForm from './PreferencesForm';
import styles from './styles.scss';

class OnlineBooking extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { activeAccount, updateEntityRequest } = this.props;
    const valuesMap = Map(values);
    const modifiedAccount = activeAccount.merge(valuesMap);
    updateEntityRequest({ key: 'accounts', model: modifiedAccount });
  }

  render() {
    const {
      activeAccount,
    } = this.props;

    if (!activeAccount) {
      return null;
    }

    const location = window.location;
    const snippet = `<script type="text/javascript" src="${location.protocol}//my.${location.hostname}:${location.port}/widgets/${activeAccount.id}/widget.js"></script>`;

    return (
      <div className={styles.mainContainer}>
        <Header
          title="Booking Widget Preferences"
          className={styles.header}
        />
        <div className={styles.formContainer}>
          <PreferencesForm
            activeAccount={activeAccount}
            handleSubmit={this.handleSubmit}
          />
        </div>
        <div className={styles.snippetContainer}>
          <div className={styles.label}>
            HTML SNIPPET
            Copy and paste the snippet below into your website, at the bottom of your body tag.
          </div>
          <CodeSnippet
            codeSnippet={snippet}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ entities }) {
  const activeAccount = entities.getIn(['accounts', 'models']).first();
  if (!activeAccount) {
    return {};
  }
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

export default enhance(OnlineBooking);
