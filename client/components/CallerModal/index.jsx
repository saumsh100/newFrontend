
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DialogBox } from '../library';

// import styles from './styles.scss';

class CallerModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      callerId
    } = this.props;


    const actions = !!callerId;

    return (
      <DialogBox
        title="Email Invite"
        type="small"
        active={actions}
        onEscKeyDown={this.reinitializeState}
        onOverlayClick={this.reinitializeState}
      >
        dasds
      </DialogBox>
    );
  }
}

CallerModal.propTypes = {
  callerId: PropTypes.string,
};

function mapStateToProps({ entities, caller }) {
  const callerId = caller.get('callerId');

  return {
    callerId,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    dispatch,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(CallerModal);
