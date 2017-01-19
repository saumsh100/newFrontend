/**
 * Created by delphit on 19.01.17.
 */

import React, {PropTypes} from 'react';

function DialogsList({patients, onChat}) {
    return (
        <ul className="dialogs__messages">
            {patients.map((patient) => {
                return (
                    <li className="messages">
                        <img className="messages__photo" src={patient.image} alt=""/>
                        <div className="messages__wrapper">
                            <div className="messages__header">
                                <div className="messages__name">{patient.firstName}</div>
                                <div className="messages__date">9:00am</div>
                            </div>
                            <div className="messages__body">
                                <div className="messages__unread">
                                    <span> 2 </span>
                                </div>
                                <div className="messages__text">Lourem ipsum eccodi san deserif
                                    codi san deserif. Ipsum eccoesede
                                    desdjrdccodi s Lourem ipsum...
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}


export default DialogsList;
