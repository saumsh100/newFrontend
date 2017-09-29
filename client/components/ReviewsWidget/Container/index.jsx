
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loading } from '../../library';
import { loadSentReview } from '../../../thunks/reviews';
import Header from '../Header';
import styles from './styles.scss';

class WidgetContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // Host app will trigger a dispatch to set sentReviewId
    // but we can't be sure that it's set by the time we load.
    if (this.props.sentReviewId) {
      this.props.loadSentReview();
    }
  }

  componentWillReceiveProps(nextProps) {
    // If it was not defined before, set it now
    if (!this.props.sentReviewId && nextProps.sentReviewId) {
      this.props.loadSentReview();
    }
  }

  render() {
    const { sentReviewId, isLoadingSentReview } = this.props;
    const LoadingView = () => (
      <div className={styles.loadingWrapper}>
        <Loading />
      </div>
    );

    return (
      <div className={styles.container}>
        <Header/>
        {!sentReviewId || isLoadingSentReview ?
          <LoadingView /> :
          this.props.children
        }
      </div>
    );
  }
}

WidgetContainer.propTypes = {};

function mapStateToProps({ reviews }) {
  return {
    sentReviewId: reviews.getIn(['review', 'sentReviewId']),
    isLoadingSentReview: reviews.get('isLoadingSentReview'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadSentReview,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetContainer);
