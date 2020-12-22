
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List, Loading } from '../../library';
import styles from './styles.scss';
import { httpClient } from '../../../util/httpClient';
import { accountShape } from '../../library/PropTypeShapes';
import OutboxItem from '../OutboxItem';

export default class OutboxRecalls extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: true,
      recalls: [],
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { account } = this.props;
    return Promise.all([httpClient().get(`/api/accounts/${account.id}/recalls/list`)])
      .then(([recallsData]) => {
        this.setState({
          isLoading: false,
          recalls: recallsData.data,
        });
      })
      .catch(err => console.error('Failed to load configs', err));
  }

  render() {
    const { recalls, isLoading } = this.state;

    let totalSuccess = 0;
    let totalErrors = 0;
    recalls.forEach((r) => {
      totalSuccess += r.success.length;
      totalErrors += r.errors.length;
    });

    if (isLoading) {
      return (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={styles.recallsWrapper}>
        {!recalls.length ? (
          <div>No Recalls</div>
        ) : (
          <div>
            <h4>Total Success: {totalSuccess}</h4>
            <h4>Total Errors: {totalErrors}</h4>
            <List>
              {recalls.map(recall => (
                <OutboxItem key={recall.id} data={recall} styles={styles} dateFormat="DD/MM/YYYY" />
              ))}
            </List>
          </div>
        )}
      </div>
    );
  }
}

OutboxRecalls.propTypes = {
  account: PropTypes.shape(accountShape).isRequired,
};
