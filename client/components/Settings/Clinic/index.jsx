
import React from 'react';

export default function Clinic({ children }) {
  // const children = React.cloneElement(props.children, { activeAccount: props.activeAccount });
  return (
    <div>
      { children }
    </div>
  );
}
