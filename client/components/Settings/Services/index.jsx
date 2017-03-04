
import React from 'react';

export default function Services(props) {
  const children = React.cloneElement(props.children, { activeAccount: props.activeAccount });
  return (
    <div>
      {children}
    </div>
  );
}
