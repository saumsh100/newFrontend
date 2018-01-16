
import { bindActionCreators } from 'redux';
import Popover from 'react-popover';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Icon, Button } from '../../../library';
import styles from '../../styles.scss';
import Filters from '../Filters';
import { setScheduleView } from '../../../../actions/schedule';

class HeaderButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilters: false,
    };

    this.setView = this.setView.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  componentDidMount() {
    const localStorageView = JSON.parse(localStorage.getItem('scheduleView'));
    if (localStorageView && (localStorageView.view !== this.props.scheduleView)) {
      const view = localStorageView.view;
      this.props.setScheduleView({ view });
    }
  }
  setView() {
    if (this.props.scheduleView === 'chair') {
      const viewObj = { view: 'practitioner' };
      localStorage.setItem('scheduleView', JSON.stringify(viewObj));
      this.props.setScheduleView({ view: 'practitioner' });
    } else {
      const viewObj = { view: 'chair' };
      localStorage.setItem('scheduleView', JSON.stringify(viewObj));
      this.props.setScheduleView({ view: 'chair' });
    }
  }

  toggleFilters() {
    this.setState({
      openFilters: !this.state.openFilters,
    });
  }

  render() {
    const {
      addNewAppointment,
      scheduleView,
      schedule,
      chairs,
      practitioners,
      services,
    } = this.props;

    return (
      <div className={styles.header}>
        <Popover
          isOpen={this.state.openFilters}
          body={[(
            <Filters
              schedule={schedule}
              chairs={chairs}
              practitioners={practitioners}
              services={services}
            />
          )]}
          preferPlace="below"
          tipSize={.01}
          onOuterAction={this.toggleFilters}
        >
          <div
            className={styles.headerLinks}
            onClick={this.toggleFilters}
          >
            <Icon
              icon="filter"
              size={1.5}
              className={styles.headerLinks_icon}
            />
          </div>
        </Popover>

        <Button
          onClick={this.setView}
          border="blue"
          iconRight="exchange"
          dense
          compact
        >
          {scheduleView === 'chair' ? 'Practitioner View' : 'Chair View'}
        </Button>

        <Button
          color="blue"
          onClick={addNewAppointment}
          dense
          compact
          className={styles.headerLinks_add}
        >
          Quick Add
        </Button>
      </div>
    );
  }
}

HeaderButtons.PropTypes = {
  addNewAppointment: PropTypes.func,
  runOnDemandSync: PropTypes.func,
  setSyncingWithPMS: PropTypes.func,
  syncingWithPMS: PropTypes.bool,
  scheduleView: PropTypes.string,
  setScheduleView: PropTypes.func,
  schedule: PropTypes.object,
  chairs: PropTypes.object,
  practitioners: PropTypes.object,
  services: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setScheduleView,
  }, dispatch);
}

function mapStateToProps({ schedule }) {
  const scheduleView = schedule.toJS().scheduleView;
  return {
    scheduleView,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(HeaderButtons);
