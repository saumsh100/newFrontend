
import React, { PropTypes, Component } from 'react';
import PatientMessages from '../components/Patients/Messages';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chat from '../components/Patients/Chat/';
import {
  setCurrentDialog,
  setDialogScrollPermission,
} from '../thunks/dialogs';
import {
  sendMessageOnClient,
  readMessagesInCurrentDialog,
} from '../thunks/fetchEntities';
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
    const username = filters
    && filters.values && filters.values.dialogs;
    if (!username) return
    if (username && !nextProps.filters.values) return;
    if (username != nextProps.filters.values.dialogs) {
      this.props.fetchEntities({ key: 'dialogs', params: { username } })
    }
  }

  render() {
    const {
      dialogs,
      setCurrentDialog,
      currentDialogId,
      sendMessageOnClient,
      filters,
      readMessagesInCurrentDialog,
      setDialogScrollPermission,
      allowDialogScroll,
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
          filters={filters}
          readMessagesInCurrentDialog={readMessagesInCurrentDialog}
          setDialogScrollPermission={setDialogScrollPermission}
          allowDialogScroll={allowDialogScroll}
        />
      </div>

    );
  }
}

PatientsMessagesContainer.propTypes = {};

function mapStateToProps({ entities, currentDialog, form }) {
    return {
      dialogs: entities.get('dialogs'),
      currentDialogId: currentDialog.toJS().currentDialog,
      allowDialogScroll: currentDialog.toJS().allowDialogScroll,
      filters: form.dialogs,
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setCurrentDialog,
    sendMessageOnClient,
    readMessagesInCurrentDialog,
    setDialogScrollPermission,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsMessagesContainer);
