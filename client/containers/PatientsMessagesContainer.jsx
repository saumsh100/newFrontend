
import React, { PropTypes, Component } from 'react';
import PatientMessages from '../components/Patients/Messages';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chat from '../components/Patients/Chat/';
import { setCurrentDialog } from '../thunks/dialogs';
import { sendMessageOnClient } from '../thunks/fetchEntities';
class PatientsMessagesContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'dialogs'});
  }

  render() {
    const {
      dialogs,
      setCurrentDialog,
      currentDialogId,
      sendMessageOnClient,
    } = this.props;
    const dialogList = dialogs.get('models').toArray();
    // const { patient, patients } = this.state;;
    return (
      <div>
        <Chat dialogList={dialogList}
          setCurrentDialog={setCurrentDialog}
          currentDialogId={currentDialogId}
          sendMessageOnClient={sendMessageOnClient}
        />
      </div>

    );
  }
}

PatientsMessagesContainer.propTypes = {};

function mapStateToProps({ entities, currentDialog }) {
    return {
      dialogs: entities.get('dialogs'),
      currentDialogId: currentDialog.toJS().currentDialog,
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setCurrentDialog,
    sendMessageOnClient,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsMessagesContainer);
