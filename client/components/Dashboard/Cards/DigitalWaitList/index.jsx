
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { List, ListItem, Card, CardHeader, Icon } from '../../../library';
import Search from '../../../library/Search';
import withEntitiesRequest from '../../../../hocs/withEntities';
import DigitalWaitListItem from './DigitalWaitListItem';
import styles from './styles.scss';

class DigitalWaitList extends Component {
  render() {
    const {
      borderColor,
      cardTitle,
      waitSpots,
      patients,
      isFetching,
    } = this.props;

    return (
      <Card className={styles.reminders}>
        <div className={styles.reminders__header}>
          <CardHeader count={waitSpots.get('models').size} title="Digital Waitlist">
            <Search />
          </CardHeader>
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {waitSpots.get('models').toArray().map((waitSpot) => {
              const patient = patients.getIn(['models', waitSpot.get('patientId')]);
              return (
                <DigitalWaitListItem
                  key={waitSpot.get('id')}
                  waitSpot={waitSpot}
                  patient={patient}
                />
              );
            })}
          </List>
        </div>
      </Card>
    );
  }
}

DigitalWaitList.propTypes = {
  waitSpots: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

function mapStateToProps({ entities }) {
  return {
    patients: entities.get('patients'),
  };
}

const enhance = compose(
  withEntitiesRequest({
    id: 'waitSpots',
    key: 'waitSpots',
    join: ['patient'],
  }),

  connect(mapStateToProps, null),
);

export default enhance(DigitalWaitList);
