
import React from 'react';

export default function Clinic(props) {
  const children = React.cloneElement(props.children, { account: props.activeAccount });
  return (
    <div>
      {children}
    </div>
  );
}
