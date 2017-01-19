import React, {PropTypes, Component} from 'react';
import moment from 'moment';

const DialogComponent = (props) => (
    <div className="message-list">
        {props.messages.get('models')
            .filter((el) => el.patientId === props.patientId)
            .map(m =>
                <ul className="message left">
                    <li className="message__item">
                        <div className="message__wrapper">
                            <div className="message__time">
                                {moment(m.createdAt).fromNow()}
                            </div>
                            <div className="message__text">
                                {m.body}
                            </div>
                            {console.log('props',props)}
                            {console.log('props - messages',props.messages.get('models'))}
                            <img className="message__avatar" src="https://randomuser.me/api/portraits/women/70.jpg"/>
                        </div>
                    </li>
                </ul>
            )}
    </div>);

DialogComponent.propTypes = {
    messages: PropTypes.array,
};

export default DialogComponent;
