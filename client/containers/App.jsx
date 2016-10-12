
import React, { PropTypes } from 'react';
import { compose, withState } from 'recompose';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from '../components/library';

function App({ location, children, isActive, setIsActive }) {
  const toggle = () => setIsActive(!isActive);
  return (
    <div>
      <h1>CareCru</h1>
      <Button
        color="primary"
        onClick={toggle}
      >
        Show Modal
      </Button>
      <Modal isOpen={isActive} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Do Something</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <div>
        {children}
      </div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};

const enhance = compose(
  withState('isActive', 'setIsActive', false)
);

export default enhance(App);
