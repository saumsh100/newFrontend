
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItem, Card, CardHeader, Icon } from '../../../library';
import Search from '../../../library/Search';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import DigitalWaitListItem from './DigitalWaitListItem';
import styles from './styles.scss';

class DigitalWaitList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'waitSpots', join: ['patient'] });
  }

  render() {
    const {
      borderColor,
      cardTitle,
      waitSpots,
    } = this.props;

    return (
      <Card className={styles.reminders}>
        <div className={styles.reminders__header}>
          <CardHeader count={waitSpots.length} title="Digital Waitlist">
            <Search />
          </CardHeader>
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {waitSpots.get('models').toArray().map((obj, index) => {
              return <DigitalWaitListItem obj={obj} index={index} />;
            })}
          </List>
        </div>
      </Card>
    );
  }
}

DigitalWaitList.propTypes = {
  waitSpots: PropTypes.object,
  patients: PropTypes.object,
  fetchEntities: PropTypes.func.isRequired,
};

function mapStateToProps({ entities }) {
  return {
    waitSpots: entities.get('waitSpots'),
    patients: entities.get('patients'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DigitalWaitList);
