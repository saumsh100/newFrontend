import React, { PropTypes } from 'react';
import {Button, Icon} from '../library/';



export default function ConfirmAppointment(props){
  return (
    <Icon icon={'check-circle'} className={props.className}/>
  );
}

ConfirmAppointment.propTypes = {
};