import React, { PropTypes, Component } from 'react';
import styles from './styles.scss';
import Messages from './Messages';

export default class ChatWindow extends Component {
	constructor(props) {
		super(props);
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentDidUpdate() {
    const { allowDialogScroll } = this.props;
    const messagesList = this.messagesList;
    if (messagesList !== null && allowDialogScroll) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  }

  sendMessage(e) {
  	const {
  		setDialogScrollPermission,
  		sendMessageOnClient
  	} = this.props;
    e.preventDefault();
    const message = this.messageText;
    if (message === '' || message.length === 0) {
      return null;
    }
    const params = {
      patientId: this.props.currentDialogId,
      body: message.value,
      createdAt: new Date(),
      read: true,
    };
    this.props.createEntityRequest({
      key: 'textMessages',
      params,
    });
    setDialogScrollPermission({ allowDialogScroll: true });
    sendMessageOnClient(params);
    // window.socket.emit('sendMessage', {
    //   message: message.value,
    //   patient: this.props.patient,
    // });
    message.value = '';
  }

	render() {
		const {
			textMessages,
			sendMessage,
			patient,
			readMessagesInCurrentDialog,
			setDialogScrollPermission,
		} = this.props;
		return (
		  <div className={styles.chat}>
		    <div className={styles.chat__header}>
		      <div className={styles.chat__address}>
		        <span className={styles.address__to}>To:</span>
		        <span className={styles.address__name}>{patient.lastName} {patient.phoneNumber}</span>
		      </div>
		    </div>
		    <div className={styles.chat__wrapper}>
		      <div className={styles.chat__body}>
		        <div className={styles.body_header}>
		          <div className={styles.body_header__username}>
		            {patient.firstName}
		            {patient.lastName}
		          </div>
		          <div className={styles.body_header__activity}>
		            Last Seen 02/23/2017 10:00 am
		          </div>
		        </div>
		        <div className={styles.message_list} ref={ref => (this.messagesList = ref)}>
		          <Messages
		          	messages={textMessages}
		          	patientId={patient.id}
		          	readMessagesInCurrentDialog={readMessagesInCurrentDialog}
		          	setDialogScrollPermission={setDialogScrollPermission}
		          />
		        </div>
		        <div className={styles.body_footer}>
		          <form onSubmit={this.sendMessage}>
		            <input ref={ref => (this.messageText = ref)} className={styles.body_footer__input} type="text" placeholder="Type a message" />
		          </form>
		          <div className={styles.body_footer__attach}></div>
		        </div>
		      </div>
		      <div className={styles.chat__partner}>
		        <div className={styles.partner}>
		          <div className={styles.partner__header}>
		            <img className={styles.partner__photo} src={patient.image} alt="avatar" />
		            <div className={styles.partner__name}>
		              Jenn Frye, 30
		            </div>
		            <div className={styles.partner__birthday}>
		              02/17/1987
		            </div>
		            <div className={styles.partner__gender}>
		              Female
		            </div>
		          </div>
		          <div className={styles.partner__main}>
		            <div className={styles.partner__phone}>
		              <a href={`tel: ${patient.phoneNumber}`}>
		                <i className="fa fa-phone" />
		                {patient.phoneNumber}
		              </a>
		            </div>
		            <div className={styles.partner__email}>
		              <a href={`mailto: ${patient.email}`}>
		                <i className="fa fa-envelope" />
		                {patient.email}
		              </a>
		            </div>
		          </div>
		          <div className={styles.partner__footer}>
		            <div className={styles.appointment}>
		              <div className={styles.appointment__last}>
		                <div className={styles.appointment__last_text}>Last appointment</div>
		                <div className={styles.appointment__last_date}>02/23/2017</div>
		              </div>
		              <div className={styles.appointment__next}>
		                <div className={styles.appointment__next_text}>Next appointment</div>
		                <div className={styles.appointment__next_date}>08/23/2017</div>
		              </div>
		            </div>
		          </div>
		        </div>
		      </div>
		    </div>
		  </div>
		);
	}
}
