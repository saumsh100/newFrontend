
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, DialogBox, RemoteSubmitButton } from '../../../library';
import ReviewItem from './ReviewItem';
import ReviewPreview from './ReviewPreview';
import AdvancedSettingsForm from './AdvancedSettingsForm';
import CommunicationSettingsCard from '../../Shared/CommunicationSettingsCard';
import IconCircle from '../../Shared/IconCircle';
import TouchPointItem, { TouchPointLabel } from '../../Shared/TouchPointItem';
import { updateReviewsSettings } from '../../../../thunks/accounts';
import styles from './styles.scss';

class Reviews extends Component {
  constructor(props) {
    super(props);
    const { activeAccount } = props;

    this.state = {
      isAdvancedSettingsOpen: false,
      selectedReview: false,
      reviewSettings: {
        interval: activeAccount.get('reviewsInterval'),
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
      },
    };

    this.toggleAdvancedSettings = this.toggleAdvancedSettings.bind(this);
    this.saveAdvancedSettings = this.saveAdvancedSettings.bind(this);
    this.selectReview = this.selectReview.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { activeAccount } = props;
    const interval = activeAccount.get('reviewsInterval');

    if (interval !== state.interval) {
      return {
        reviewSettings: {
          ...state.reviewSettings,
          interval,
        },
      };
    }
    return null;
  }

  toggleAdvancedSettings() {
    this.setState({
      isAdvancedSettingsOpen: !this.state.isAdvancedSettingsOpen,
    });
  }

  saveAdvancedSettings(values) {
    const { activeAccount } = this.props;
    const { sendUnconfirmedReviews } = values;
    let { lastReviewInterval, lastSentReviewInterval } = values;
    lastReviewInterval = lastReviewInterval === 'null' ? null : lastReviewInterval;
    lastSentReviewInterval = lastSentReviewInterval === 'null' ? null : lastSentReviewInterval;
    const alert = {
      success: {
        title: 'Reviews Settings Updated',
        body: 'Successfully updated the advanced settings for reviews',
      },

      error: {
        title: 'Failed to Update Reviews Settings',
        body: 'Error trying to update the advanced settings for reviews',
      },
    };

    this.props
      .updateReviewsSettings(
        activeAccount.id,
        {
          sendUnconfirmedReviews,
          lastReviewInterval,
          lastSentReviewInterval,
        },
        alert,
      )
      .then(this.toggleAdvancedSettings);
  }

  selectReview() {
    if (this.state.selectedReview) return;
    this.setState({ selectedReview: true });
  }

  renderLeftColumn() {
    return (
      <div>
        <TouchPointItem
          className={styles.bottomItem}
          mainComponent={
            <div className={styles.bottomBox}>
              <div className={styles.bottomIconContainer}>
                <IconCircle icon="calendar" color="blue" />
              </div>
              <div className={styles.bottomLabel}>
                <TouchPointLabel title="Appointment" />
              </div>
            </div>
          }
        />
        {this.renderReviewItem()}
      </div>
    );
  }

  renderRightActions() {
    return this.props.role === 'SUPERADMIN' ? (
      <Button border="blue" onClick={this.toggleAdvancedSettings}>
        Advanced Settings
      </Button>
    ) : null;
  }

  renderPreviewColumn() {
    if (!this.state.selectedReview) {
      return null;
    }

    return <ReviewPreview review={this.state.reviewSettings} account={this.props.activeAccount} />;
  }

  renderReviewItem() {
    if (!this.state.reviewSettings) {
      return null;
    }

    return (
      <ReviewItem
        key="select"
        noLines
        selected={this.state.selectedReview}
        onSelect={this.selectReview}
        account={this.props.activeAccount}
        reviewSettings={this.state.reviewSettings}
      />
    );
  }

  render() {
    return (
      <CommunicationSettingsCard
        title="Reviews Settings"
        rightActions={this.renderRightActions()}
        leftColumn={this.renderLeftColumn()}
        rightColumn={this.renderPreviewColumn()}
      >
        <DialogBox
          actions={[
            {
              label: 'Cancel',
              onClick: this.toggleAdvancedSettings,
              component: Button,
              props: { border: 'blue' },
            },
            {
              label: 'Save',
              onClick: this.saveAdvancedSettings,
              component: RemoteSubmitButton,
              props: {
                color: 'blue',
                form: 'reviewsAdvancedSettings',
              },
            },
          ]}
          title="Reviews Advanced Settings"
          type="medium"
          active={this.state.isAdvancedSettingsOpen}
          onEscKeyDown={this.toggleAdvancedSettings}
          onOverlayClick={this.toggleAdvancedSettings}
        >
          <AdvancedSettingsForm
            form="reviewsAdvancedSettings"
            initialValues={this.props.activeAccount.toJS()}
            onSubmit={this.saveAdvancedSettings}
          />
        </DialogBox>
      </CommunicationSettingsCard>
    );
  }
}

Reviews.propTypes = {
  role: PropTypes.string.isRequired,
  activeAccount: PropTypes.shape({
    id: PropTypes.string,
    reviewSettings: PropTypes.string,
    toJS: PropTypes.func,
  }).isRequired,

  updateReviewsSettings: PropTypes.func.isRequired,
};

const mapStateToProps = ({ entities, auth }) => ({
  role: auth.get('role'),
  activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateReviewsSettings }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reviews);
