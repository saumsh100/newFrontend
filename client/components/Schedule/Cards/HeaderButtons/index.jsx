
import { bindActionCreators } from 'redux';
import Popover from 'react-popover';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Icon, Button } from '../../../library';
import styles from '../../styles.scss';
import { runOnDemandSync } from '../../../../thunks/runOnDemandSync';
import Filters from '../Filters';

import { setSyncingWithPMS, setScheduleView } from '../../../../actions/schedule';
import FilterField from "../../../library/Filters/FilterField";

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
      runOnDemandSync,
      setSyncingWithPMS,
      syncingWithPMS,
      scheduleView,
      setScheduleView,
      schedule,
      chairs,
      practitioners,
      services,
    } = this.props;

    function onDemandSync() {
      if (!syncingWithPMS) {
        console.log('onDemandSync: running on demand sync');
        setSyncingWithPMS({ isSyncing: true })
        runOnDemandSync()
          .then(() => {
            console.log('Just sent on demand sync; result');
          });
      }
    }

    let syncStyle = styles.headerButtons__quickAdd;

    if (syncingWithPMS) {
      syncStyle = classNames(styles.disabledStyle, syncStyle);
    }

    return (
      <div className={styles.headerButtons}>
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
            className={styles.headerButtons__quickAdd}
            onClick={this.toggleFilters}
          >
            <Icon
              icon="filter"
              size={1.5}
              className={styles.headerButtons__quickAdd_icon}
            />
          </div>
        </Popover>

        <Button
          onClick={this.setView}
          border="blue"
          iconRight="exchange"
          className={styles.headerButtons_buttonText}
        >
          {scheduleView} View
        </Button>

        <Button
          color="blue"
          onClick={addNewAppointment}
          className={styles.headerButtons_buttonText}
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
    runOnDemandSync,
    setScheduleView,
    setSyncingWithPMS,
  }, dispatch);
}

function mapStateToProps({ schedule }) {
  const syncingWithPMS = schedule.toJS().syncingWithPMS;
  const scheduleView = schedule.toJS().scheduleView;
  return {
    syncingWithPMS,
    scheduleView,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(HeaderButtons);
