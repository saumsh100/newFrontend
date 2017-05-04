
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import {
  Grid,
  Row,
  Col,
  IconButton,
} from '../../../library';
import * as Thunks from '../../../../thunks/availabilities';
import styles from './styles.scss';

const getSortedAvailabilities = (momentDate, availabilities) => {
  const filteredAvailabilities = availabilities.filter(a => moment(a.startDate).isSame(momentDate, 'd'));
  return filteredAvailabilities.sort((a, b) => moment(a).diff(b));
};

class AvailabilitiesDisplay extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchAvailabilities();
  }

  render() {
    const {
      // startDate,
      // availabilities,
      onSelect,
      onSixDaysBack,
      onSixDaysForward,
      selectedAvailability = {},
    } = this.props;

    const numDaysForward = 4;
    const dayAvailabilities = [];

    const availabilities = [
      {
        startDate: (new Date(2017, 4, 1, 12, 0)).toISOString(),
        endDate: (new Date(2017, 4, 1, 13, 0)).toISOString(),
      },
      {
        startDate: (new Date(2017, 4, 1, 13, 0)).toISOString(),
        endDate: (new Date(2017, 4, 1, 14, 0)).toISOString(),
      },
      {
        startDate: (new Date(2017, 4, 2, 14, 0)).toISOString(),
        endDate: (new Date(2017, 4, 2, 15, 0)).toISOString(),
      },
      {
        startDate: (new Date(2017, 4, 3, 9, 0)).toISOString(),
        endDate: (new Date(2017, 4, 3, 10, 0)).toISOString(),
      },
    ];

    const startDate = new Date();

    let i;
    for (i = 0; i <= numDaysForward; i++) {
      const momentDate = moment(startDate).add(i, 'days');
      const sortedAvailabilities = getSortedAvailabilities(momentDate, availabilities);
      dayAvailabilities.push({ momentDate, sortedAvailabilities });
    }

    console.log(dayAvailabilities);

    return (
      <Grid onClick={onSelect}>
        <Row>
          <Col xs={1} className={styles.centeredContent}>
            <IconButton
              icon="arrow-circle-o-left"
              className={styles.appointment__table_btn}
              onClick={onSixDaysForward}
            />
          </Col>
          <Col xs={10} className={styles.columnsWrapper}>
            <div className={styles.appointment__table_elements}>
              {dayAvailabilities.map((a) => {
                console.log(a.sortedAvailabilities);
                return (
                  <ul className={styles.appointment__list} key={a.startDate}>
                    <div className={styles.appointment__list_header}>
                      <div className={styles.list__header_day}>
                        {a.momentDate.format('ddd')}
                      </div>
                      <div className={styles.list__header_number}>
                        {a.momentDate.format('DD/MM/YYYY')}
                      </div>
                    </div>
                    {a.sortedAvailabilities.map((availability) => {
                      return (
                        <li
                          key={availability.startDate}
                          onClick={() => onSelect(availability)}
                          className={`${styles.appointment__list_item} ${availability.isBusy ? styles.appointment__list_active : ''} ${availability.startDate === selectedAvailability.startDate ? styles.appointment__list_selected : ''}`}
                        >
                          {moment(availability.startDate).format('HH:mm A')}
                        </li>
                      );
                    })}
                  </ul>
                );
              })}
            </div>
          </Col>
          <Col xs={1} className={styles.centeredContent}>
            <IconButton
              icon="arrow-circle-o-right"
              className={styles.appointment__table_btn}
              onClick={onSixDaysForward}
            />
          </Col>
        </Row>
      </Grid>
    );
  }


  // TODO: change Left/Right Buttons to Button elements with Icons
  // TODO: break out the availabilities component into columns and lists
}

AvailabilitiesDisplay.propTypes = {
  // startsAt: PropTypes.prop,
  availabilities: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func.isRequired,
  onSixDaysBack: PropTypes.func.isRequired,
  onSixDaysForward: PropTypes.func.isRequired,
  fetchAvailabilities: PropTypes.func.isRequired,
};

function mapStateToProps({ availabilities }) {
  return {

  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAvailabilities: Thunks.fetchAvailabilities
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailabilitiesDisplay);
