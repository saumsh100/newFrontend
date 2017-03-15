
import React from 'react';

export default function Schedule(props) {
  const children = React.cloneElement(props.children, { activeAccount: props.activeAccount });
  return (
    <div>
      {children}
    </div>
  );
}
