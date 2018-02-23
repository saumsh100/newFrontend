import React from 'react';
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

    this.state = {
      selectedReview: false,
    };
  }

  componentDidMount() {
    this.setState({
      reviewSettings: {
        interval: '2 hours',
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
      },
    });
  }

  toggleSelect() {
    this.setState({ selectedReview: !this.state.selectedReview });
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
        onSelect={this.toggleSelect.bind(this)}
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

const mapStateToProps = ({ entities, auth }) => ({
  activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
});

export default connect(mapStateToProps, null)(Reviews);

