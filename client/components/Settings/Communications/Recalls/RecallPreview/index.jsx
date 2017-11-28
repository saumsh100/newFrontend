
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  SContainer,
  SHeader,
  SBody,
  SMSPreview,
} from '../../../../library';
import EmailPreview from '../../../Shared/EmailPreview';
import createRecallText from '../../../../../../server/lib/recalls/createRecallText';
import styles from './styles.scss';

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
      const url = `/api/accounts/${account.id}/recalls/${recall.id}/preview`;
      typePreview = (
        <div className={styles.smsPreviewWrapperFull}>
          <EmailPreview url={url} />
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
