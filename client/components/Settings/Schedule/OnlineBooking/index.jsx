
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { Header, CodeSnippet } from '../../../library';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import PreferencesForm from './PreferencesForm';
import styles from './styles.scss';

function hexToRgbA(hex, opacity) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c &255].join(',')}, ${opacity})`;
  }
  throw new Error('Bad Hex');
}

class OnlineBooking extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { activeAccount, updateEntityRequest } = this.props;
    console.log(hexToRgbA(values.bookingWidgetPrimaryColor, 1))
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
    updateEntityRequest({ key: 'accounts', model: modifiedAccount, alert });
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

OnlineBooking.propTypes = {
  activeAccount: PropTypes.object.required,
  updateEntityRequest: PropTypes.func.required,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

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
