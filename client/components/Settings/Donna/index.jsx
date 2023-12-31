
import React from 'react';

export default function Donna(props) {
  const children = React.cloneElement(props.children, {
    activeAccount: props.activeAccount,
  });
  return <div style={{ height: '100%' }}>{children}</div>;
}
