
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Icon } from '../../../library';
import styles from '../../styles.scss';
import { runOnDemandSync } from '../../../../thunks/runOnDemandSync';

import { setSyncingWithPMS, setScheduleView } from '../../../../actions/schedule';

class HeaderButtons extends Component {
  constructor(props) {
    super(props);
    this.setView = this.setView.bind(this);
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

  render() {
    const {
      addNewAppointment,
      runOnDemandSync,
      setSyncingWithPMS,
      syncingWithPMS,
      scheduleView,
      setScheduleView,
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
        <div
          className={styles.headerButtons__quickAdd}
          onClick={this.setView}
        >
          <span className={styles.headerButtons__quickAdd_text}>{scheduleView} View</span>
          <Icon
            icon="exchange"
            size={1.5}
            className={styles.headerButtons__quickAdd_icon}
          />
        </div>
        <div
          className={syncStyle}
          onClick={onDemandSync}
        >
          <span className={styles.headerButtons__quickAdd_text}> Sync PMS </span>
          <Icon
            icon="sync"
            size={1.5}
            className={styles.headerButtons__quickAdd_icon}
          />
        </div>
        <div>
          <div className={styles.headerButtons__quickAdd} onClick={addNewAppointment}>
            <span className={styles.headerButtons__quickAdd_text} data-test-id="quickAddAppointment"> Quick Add </span>
            <Icon
              icon="plus-circle"
              size={1.5}
              className={styles.headerButtons__quickAdd_icon}
            />
          </div>
        </div>
      </div>
    );
  }
}

HeaderButtons.PropTypes = {
  addNewAppointment: PropTypes.func,
  runOnDemandSync: PropTypes.func,
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
