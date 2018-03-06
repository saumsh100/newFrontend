import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReviewItem from './ReviewItem';
import ReviewPreview from './ReviewPreview';
import CommunicationSettingsCard from '../../Shared/CommunicationSettingsCard';
import IconCircle from '../../Shared/IconCircle';
import TouchPointItem, { TouchPointLabel } from '../../Shared/TouchPointItem';
import styles from './styles.scss';

class Reviews extends React.Component {
  constructor(props) {
    super(props);
    const { activeAccount } = props;

    this.state = {
      selectedReview: false,
      reviewSettings: {
        interval: activeAccount.get('reviewsInterval'),
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
      },
    };
  }

  componentWillReceiveProps(newProps) {
    const { activeAccount } = newProps;
    const interval = activeAccount.get('reviewsInterval');

    if (interval === this.state.reviewSettings.interval) {
      return;
    }

    this.setState({
      reviewSettings: {
        ...this.state.reviewSettings,
        interval,
      },
    });
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
          mainComponent={(
            <div className={styles.bottomBox}>
              <div className={styles.bottomIconContainer}>
                <IconCircle
                  icon="calendar"
                  color="blue"
                />
              </div>
              <div className={styles.bottomLabel}>
                <TouchPointLabel title="Appointment" />
              </div>
            </div>
          )}
        />
        {this.renderReviewItem()}
      </div>
    );
  }

  renderPreviewColumn() {
    if (!this.state.selectedReview) {
      return null;
    }

    return (
      <ReviewPreview
        review={this.state.reviewSettings}
        account={this.props.activeAccount}
      />
    );
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
        onSelect={this.selectReview.bind(this)}
        account={this.props.activeAccount}
        reviewSettings={this.state.reviewSettings}
      />
    );
  }

  render() {
    return (
      <CommunicationSettingsCard
        title="Reviews Settings"
        leftColumn={this.renderLeftColumn()}
        rightColumn={this.renderPreviewColumn()}
      />
    );
  }
}

Reviews.propTypes = {
  activeAccount: PropTypes.shape({
    id: PropTypes.string,
    reviewSettings: PropTypes.string,
  }),
};

const mapStateToProps = ({ entities, auth }) => ({
  activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
});

export default connect(mapStateToProps, null)(Reviews);
