
import React from 'react';

export default function Clinic(props) {
  return (
    <div>
      <span>Clinic Settings</span>
      <div>
        {props.children}
      </div>
    </div>
  );
}
