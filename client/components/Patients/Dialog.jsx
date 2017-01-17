
import React, { PropTypes, Component } from 'react';
import moment from 'moment';

const DialogComponent = (props) => (
  <ul className="dialogs__messages" >
  {props.messages.get('models')
    .filter((el) => el.patientId === props.patientId)
    .map(m =>
      <li className="messages">
        <img className="messages__photo" src="./img/people.png" alt="" />
        <div className="messages__wrapper">
            <div className="messages__header">
                <div className="messages__name"></div>
                <div className="messages__date">
                  {moment(m.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                </div>
            </div>
            <div className="messages__body">
                <div className="messages__unread">
                    <span></span>
                </div>
                <div className="messages__text">
                  {m.body}
                </div>
            </div>
        </div>
    </li>
  )}
</ul>
);

DialogComponent.propTypes = {
  messages: PropTypes.array,
};

export default DialogComponent;
