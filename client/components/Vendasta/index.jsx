
import PropTypes from 'prop-types';
import React from 'react';
import { withState, compose } from 'recompose';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from '../library';

function Dashboard({ isActive, setIsActive }) {
  const toggle = () => setIsActive(!isActive);
  return (
    <div>
      <h1 />
    </div>
  );
}

const enhance = compose(withState('isActive', 'setIsActive', false));

export default enhance(Dashboard);
