
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Icon } from '../../../library';
import styles from '../../styles.scss';
import { runOnDemandSync } from '../../../../thunks/runOnDemandSync';

import { setSyncingWithPMS } from '../../../../actions/schedule';

// export default function HeaderButtons(props) {
class HeaderButtons extends Component {
  render() {
    const {
      addNewAppointment,
      runOnDemandSync,
      setSyncingWithPMS,
      syncingWithPMS,
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
          className={syncStyle}
          onClick={onDemandSync}
        >
          <span className={styles.headerButtons__quickAdd_text}> Sync ClearDent </span>
          <Icon
            icon="refresh"
            size={1.5}
            className={styles.headerButtons__quickAdd_icon}
          />
        </div>
        <div>
          <div className={styles.headerButtons__quickAdd} onClick={addNewAppointment}>
            <span className={styles.headerButtons__quickAdd_text}> Quick Add </span>
            <Icon
              icon="plus"
              size={1.5}
              className={styles.headerButtons__quickAdd_icon}
            />
          </div>
          {/* <IconButton icon="plus" onClick={(e)=>{
           e.stopPropagation()
           props.showAlert({ text: 'Created An Appointment', type: 'success' });
           }}/>
           <IconButton icon="plus" onClick={(e)=>{
           e.stopPropagation()
           props.showAlert({ text: 'Failed to Update', type: 'error' });
           }}/>*/}
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
    setSyncingWithPMS,
  }, dispatch);
}

function mapStateToProps({ schedule }) {

  const syncingWithPMS = schedule.toJS().syncingWithPMS;
  return {
    syncingWithPMS,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(HeaderButtons);
