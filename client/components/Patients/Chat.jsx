import React, {PropTypes, Component} from 'react';
import {Card} from '../library';
import SendMessageInput from './SendMessageInput';
import Dialog from './Dialog';
import DialogsList from './DialogsList';

/* Todo:
* - render dialogs (last message, unread messages)
* - */
class Chat extends Component {
    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        const {patient} = this.props;
    }

    sendMessage(e) {
        e.preventDefault();
        let message = this.refs.messageText.value;
        if (message == '' || message.length == 0) {
            return null;
        } else {
            console.log('message', message);
            window.socket.emit('sendMessage', {
                message,
                patient: this.props.patient,
            });
            this.refs.messageText.value = '';
        }
    }

    render() {
        const {patient, patients, textMessages} = this.props;
        console.log(textMessages.get('models').size);
        if (patient === null) return <div>Loading...</div>;
        return (
            <div className="chat__container">
                <div className="chat">
                    <div className="chat__header">
                        <div className="chat__address address">
                            <span className="address__to">To:</span>
                            <span className="address__name">{patient.lastName} {patient.phoneNumber}</span>
                        </div>
                    </div>
                    <div className="chat__wrapper">
                        <div className="chat__body">
                            <div className="body-header">
                                <div className="body-header__username">
                                    {patient.firstName} {patient.lastName}
                                </div>
                                <div className="body-header__activity">
                                    Last Seen 02/23/2017 10:00 am
                                </div>
                            </div>
                            <Dialog messages={textMessages} patientId={patient.id}/>
                            <div className="body-footer">
                                <form >
                                    <input ref='messageText' className="body-footer__input" type="text"
                                           placeholder="Type a message"/>
                                </form>
                                <div className="body-footer__">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Chat.propTypes = {
    patient: PropTypes.object,
    textMessages: PropTypes.object.isRequired,
};

export default Chat;
