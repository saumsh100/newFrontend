
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loading } from '../../library';
import { loadSentReview } from '../../../thunks/reviews';
import styles from './styles.scss';

class WidgetContainer extends Component {
  componentDidMount() {
    if (this.props.sentReviewId) {
      this.props.loadSentReview();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.sentReviewId && this.props.sentReviewId) {
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
        {!sentReviewId || isLoadingSentReview ? <LoadingView /> : this.props.children}
      </div>
    );
  }
}

WidgetContainer.propTypes = {
  children: PropTypes.elementType.isRequired,
  sentReviewId: PropTypes.string,
  isLoadingSentReview: PropTypes.bool,
  loadSentReview: PropTypes.func.isRequired,
};

WidgetContainer.defaultProps = {
  sentReviewId: '',
  isLoadingSentReview: false,
};

function mapStateToProps({ reviews }) {
  return {
    sentReviewId: reviews.getIn(['sentReview', 'id']),
    isLoadingSentReview: reviews.get('isLoadingSentReview'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadSentReview,
    },
    dispatch,
  );
}

WidgetContainer.propTypes = {
  sentReviewId: PropTypes.string.isRequired,
  isLoadingSentReview: PropTypes.bool.isRequired,
  loadSentReview: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WidgetContainer);
