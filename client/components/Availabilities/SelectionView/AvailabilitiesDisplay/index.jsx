
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import classNames from 'classnames';
import {
  Grid,
  Row,
  Col,
  IconButton,
} from '../../../library';
import * as Actions from '../../../../actions/availabilities';
import * as Thunks from '../../../../thunks/availabilities';
import styles from './styles.scss';

const getSortedAvailabilities = (momentDate, availabilities) => {
  // TODO: This could be sped up, we can assume availabilities are in order
  return availabilities.filter(a => moment(a.startDate).isSame(momentDate, 'd'));
  // return filteredAvailabilities.sort((a, b) => moment(a).diff(b));
};

class AvailabilitiesDisplay extends Component {
  constructor(props) {
    super(props);

    this.setDateBack = this.setDateBack.bind(this);
    this.setDateForward = this.setDateForward.bind(this);
  }

  componentWillMount() {
    this.props.fetchAvailabilities();
  }

  componentWillReceiveProps(nextProps) {
    const shouldFetchAvailabilities = (nextProps.selectedPractitionerId !== this.props.selectedPractitionerId) ||
                                      (nextProps.selectedServiceId !== this.props.selectedServiceId) ||
                                      (nextProps.selectedStartDate !== this.props.selectedStartDate);

    if (shouldFetchAvailabilities) {
      this.props.fetchAvailabilities();
    }
  }

  setDateBack() {
    const newStartDate = moment(this.props.selectedStartDate).subtract(4, 'days').toISOString();
    this.props.setSelectedStartDate(newStartDate);
  }

  setDateForward() {
    const newStartDate = moment(this.props.selectedStartDate).add(4, 'days').toISOString();
    this.props.setSelectedStartDate(newStartDate);
  }

  render() {
    const {
      isFetching,
      availabilities,
      selectedStartDate,
      selectedAvailability,
      setSelectedAvailability,
    } = this.props;

    const numDaysForward = 4;
    const dayAvailabilities = [];
    // const startDate = new Date();

    let i;
    for (i = 0; i <= numDaysForward; i++) {
      const momentDate = moment(selectedStartDate).add(i, 'days');
      const sortedAvailabilities = getSortedAvailabilities(momentDate, availabilities);
      dayAvailabilities.push({ momentDate, sortedAvailabilities });
    }

    const headerClasses = classNames(styles.appointment__table_elements);
    const header = (
      <div className={headerClasses}>
        {dayAvailabilities.map((a) => {
          return (
            <ul className={styles.appointment__list} key={`${a.momentDate.toISOString()}_header`}>
              <div className={styles.appointment__list_header}>
                <div className={styles.list__header_day}>
                  {a.momentDate.format('ddd')}
                </div>
                <div className={styles.list__header_number}>
                  {a.momentDate.format('DD/MM/YYYY')}
                </div>
              </div>
            </ul>
          );
        })}
      </div>
    );

    // console.log(dayAvailabilities);
    let availabilitiesDisplay = (
      <div className={styles.displayContainer}>
        <i className={`fa fa-spinner fa-spin fa-3x fa-fw ${styles.loadingSpinnerIcon}`} />
      </div>
    );

    if (!isFetching) {
      if (availabilities.length) {
        availabilitiesDisplay = (
          <div className={styles.displayAvailabilitiesContainer}>
            <div className={styles.appointment__table_elements}>
              {dayAvailabilities.map((a) => {
                return (
                  <ul className={styles.appointment__list} key={`${a.momentDate.toISOString()}_list`}>
                    {a.sortedAvailabilities.map((availability) => {
                      let classes = styles.appointment__list_item;
                      if (selectedAvailability && selectedAvailability.startDate === availability.startDate) {
                        classes = `${classes} ${styles.appointment__list_selected}`;
                      }

                      return (
                        <li
                          key={`${availability.startDate}_item`}
                          onClick={() => setSelectedAvailability(availability)}
                          className={classes}
                        >
                          {moment(availability.startDate).format('h:mm a')}
                        </li>
                      );
                    })}
                  </ul>
                );
              })}
            </div>
          </div>
        );
      } else {
        availabilitiesDisplay = (
          <div className={styles.displayContainer}>
            There are no available appointments
          </div>
        );
      }
    }

    const canGoBack = moment(selectedStartDate).diff(Date.now(), 'days') > 0;

    return (
      <Grid>
        <Row>
          <Col xs={1} className={styles.centeredContent}>
            {canGoBack ?
              <IconButton
                icon="arrow-circle-o-left"
                className={styles.appointment__table_btn}
                onClick={this.setDateBack}
              /> : null}
          </Col>
          <Col xs={10} className={styles.columnsWrapper}>
            <div className={styles.displayWrapperForHorizontalScroll}>
              {header}
              {availabilitiesDisplay}
            </div>
          </Col>
          <Col xs={1} className={styles.centeredContent}>
            <IconButton
              icon="arrow-circle-o-right"
              className={styles.appointment__table_btn}
              onClick={this.setDateForward}
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
  isFetching: PropTypes.bool.isRequired,
  fetchAvailabilities: PropTypes.func.isRequired,
  selectedStartDate: PropTypes.string.isRequired,
  selectedPractitionerId: PropTypes.string,
  selectedServiceId: PropTypes.string.isRequired,
  selectedAvailability: PropTypes.object,
  setSelectedStartDate: PropTypes.func.isRequired,
  setSelectedAvailability: PropTypes.func.isRequired,
};

function mapStateToProps({ availabilities }) {
  return {
    isFetching: availabilities.get('isFetching'),
    availabilities: availabilities.get('availabilities'),
    selectedStartDate: availabilities.get('selectedStartDate'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedAvailability: availabilities.get('selectedAvailability'),
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAvailabilities: Thunks.fetchAvailabilities,
    setSelectedStartDate: Actions.setSelectedStartDate,
    setSelectedAvailability: Actions.setSelectedAvailability,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailabilitiesDisplay);
