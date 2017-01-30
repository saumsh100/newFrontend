
import React, { PropTypes, Component } from 'react';
import PatientMessages from '../components/Patients/Messages';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chat from '../components/Patients/Chat/';
import { setCurrentDialog, setDialogsFilter } from '../thunks/dialogs';
import { sendMessageOnClient } from '../thunks/fetchEntities';
import moment from 'moment';
class PatientsMessagesContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'dialogs'});
  }

  componentWillReceiveProps(nextProps) {
    const { filters } = this.props;
    const username = filters && filters.username; 
    if (!!username) {
      this.props.fetchEntities({ key: 'dialogs', params: { username } })
    }
  }

  render() {
    const {
      dialogs,
      setCurrentDialog,
      currentDialogId,
      sendMessageOnClient,
      setDialogsFilter,
      filters,
    } = this.props;
    const dialogList = dialogs.get('models')
      .toArray()
      .sort((c,d) => (moment(c.lastMessageTime) < moment(d.lastMessageTime)));
    return (
      <div>
        <Chat dialogList={dialogList}
          setCurrentDialog={setCurrentDialog}
          currentDialogId={currentDialogId}
          sendMessageOnClient={sendMessageOnClient}
          setDialogsFilter={setDialogsFilter}
          filters={filters}
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
      filters: currentDialog.toJS().filters,
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setCurrentDialog,
    sendMessageOnClient,
    setDialogsFilter,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsMessagesContainer);
