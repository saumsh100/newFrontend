
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import { Avatar } from '../library';
import styles from './styles.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // Without this, none of our themed styles would work
    const color = this.props.account.get('bookingWidgetPrimaryColor') || '#ff715a';
    document.documentElement.style.setProperty('--primaryColor', color);
    document.documentElement.style.setProperty('--primaryButtonColor', color);
  }

  componentDidUpdate(prevProps) {
    // Scroll to top of view when route changes
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.containerNode.scrollTop = 0;
    }
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <div className={styles.reviewsWidgetContainer}>
        <div className={styles.reviewsWidgetCenter}>
          <Header />
          {/*<div className={styles.tmpContainer}>
            <div className={styles.col}>
              <Avatar
                user={{ avatarUrl: "//dsw5h1xg5uvx.cloudfront.net/dc7c40b4-ed5e-44e3-9e99-a179df958ca1circle_medium__v1__.png" }}
              />
            </div>
            <div className={styles.col}>
              <div className={styles.service}>
                Regular Service & Cleaning
              </div>
              <div className={styles.date}>
                Fri, Oct. 10th - 1:30 PM
              </div>
            </div>
          </div>*/}
          <div className={styles.container} ref={node => this.containerNode = node}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Widget.propTypes = {};

function mapStateToProps({ reviews }) {
  const account = reviews.get('account');
  return {
    account,
  };
}

export default withRouter(connect(mapStateToProps, null)(Widget));
