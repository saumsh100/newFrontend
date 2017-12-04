
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Lorem from 'react-lorem-component';
import moment from 'moment';
import {
  updateEntityRequest,
  deleteEntityRequest,
  fetchEntities,
} from '../../../../../thunks/fetchEntities';
import {
  Button,
  Icon,
  Grid,
  Row,
  Col,
  Toggle,
  Input,
  DropdownSelect,
  Tabs,
  Tab,
  Header,
  SContainer,
  SHeader,
  SBody,
  SMSPreview,
} from '../../../../library';
import createRecallText from '../../../../../../server/lib/recalls/createRecallText';
import styles from './styles.scss';

const reminderMessage = 'Jane, this is a friendly reminder that you have an upcoming appointment with Dental Practice' +
  'on October 1st at 4 PM. Please take a moment to confirm your appointment by responding with \'C\'.';

class RecallPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    // If new reminder is selected, go to Unconfirmed Tab
    if ((nextProps.recall.id !== this.props.recall.id) && (this.state.index !== 0)) {
      this.setState({
        index: 0,
      });
    }
  }

  render() {
    const {
      recall,
      account,
    } = this.props;

    const { primaryType } = recall;
    const { index } = this.state;
    const isConfirmable = index === 1;

    // Fake Jane Doe Data
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    let typePreview = null;
    if (primaryType === 'sms') {
      const recallMessage = createRecallText({ patient, account, recall });
      typePreview = (
        <div className={styles.smsPreviewWrapper}>
          <SMSPreview
            from="+1 (604) 404-1122"
            message={recallMessage}
          />
        </div>
      );
    } else if (primaryType === 'email') {
      typePreview = (
        <div className={styles.smsPreviewWrapper}>
          {`Email Preview`}
        </div>
      );
    } else if (primaryType === 'phone') {
      typePreview = (
        <div className={styles.smsPreviewWrapper}>
          {`Phone Preview`}
        </div>
      );
    }

    return (
      <SContainer>
        <SHeader className={styles.previewHeader}>
          <div className={styles.topHeader}>
            <Header title="Preview" />
          </div>
        </SHeader>
        <SBody className={styles.previewSBody}>
          {/* TODO: No need for Tabs here, just need to be able to determine type and isConfirmable */}
          {typePreview}
        </SBody>
      </SContainer>
    );
  }
}

RecallPreview.propTypes = {
  recall: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
};

/*function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}*/

// const enhance = connect(null, mapDispatchToProps);

export default RecallPreview;
