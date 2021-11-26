import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { IconButton } from '../../library';
import styles from './styles.scss';
import { accountShape } from '../../library/PropTypeShapes';
import { useGetNotificationsCount } from '../../GraphQLForms/useGetNotificationsCount';
import { useSubscriptionNotification } from '../../GraphQLForms/useSubscribeSubmissionNotifications';

const FormsNotificationButton = (props) => {
  const [count, setCount] = useState(0);

  const practiceId = props?.account?.id || '';

  const { data } = useGetNotificationsCount(practiceId);
  const { data: updatedNotificationCount } = useSubscriptionNotification();

  useEffect(() => {
    if (data?.countAllNotActionedSubmissions || updatedNotificationCount?.submissionNotification) {
      setCount(
        updatedNotificationCount?.submissionNotification?.count ||
          data.countAllNotActionedSubmissions,
      );
    }
  }, [data?.countAllNotActionedSubmissions, updatedNotificationCount?.submissionNotification]);

  const handleNotifications = () => {
    if (count === 0) return null;
    props.push('/settings/forms/submissions');
  };

  return (
    <IconButton
      className={styles.formNotificationsWrapper}
      iconClassName={styles.formNotifications}
      icon="file-alt"
      badgeText={count}
      onClick={handleNotifications}
    />
  );
};

const mapStateToProps = ({ auth }) => ({
  account: auth.get('account').toJS(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      push,
    },
    dispatch,
  );
}

FormsNotificationButton.propTypes = {
  account: PropTypes.shape(accountShape).isRequired,
  push: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsNotificationButton);
