
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { IconButton } from '../../../library';
import styles from '../../styles.scss';
import runOnDemandSync from '../../../../thunks/runOnDemandSync';

// export default function HeaderButtons(props) {
class HeaderButtons extends Component {
  render() {
    const {
      addNewAppointment,
      runOnDemandSync,
    } = this.props;

    function onDemandSync() {
      console.log('onDemandSync: running on demand sync');
      runOnDemandSync()
        .then(() => {
          console.log('Just sent on demand sync; result');
        });
    }

    return (
      <div className={styles.headerButtons}>
        <div className={styles.headerButtons__quickAdd} onClick={onDemandSync}>
          Sync ClearDent
          <span>
          <IconButton
            icon="refresh"
            size={0.8}
            className={styles.headerButtons__quickAdd_icon}
          />
        </span>
        </div>
        <div>
          <div className={styles.headerButtons__quickAdd} onClick={addNewAppointment}>
            Quick Add
            <span>
          <IconButton
            icon="plus"
            size={0.8}
            className={styles.headerButtons__quickAdd_icon}
          />
        </span>
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
  }, dispatch);
}

function mapStateToProps() {
  return {};
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(HeaderButtons);
