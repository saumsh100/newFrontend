
import React, { PropTypes } from 'react';
import { withState, compose } from 'recompose';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from '../library';
import { Card, CardBlock, CardTitle, CardSubtitle, CardText, CardLink } from 'reactstrap';
import Listings from '../Listings';
import Reviews from '../Reviews';
import styles from './styles.scss';
import {fetchReputation} from '../../reducers/reputation/actions'

class Dashboard extends React.Component {
  constructor () {
    super()
  }

  componentDidMount() {
    this.props.fetchReputation()
  }

  toggle () {
    setIsActive(!isActive);
  }
  render () {

    return (
      <div style={{ padding: '20px' }}>
        <Card className={styles.cardContainer}>
          <CardBlock>
            <CardTitle>
              <Link to="/reputation">Listings</Link>
            </CardTitle>
          </CardBlock>
          <CardBlock>
            <Listings />
          </CardBlock>
        </Card>
        <Card className={styles.cardContainer}>
          <CardBlock>
            <CardTitle>
              <Link to="/reputation">Reviews</Link>
            </CardTitle>
          </CardBlock>
          <CardBlock>
            <Reviews />
          </CardBlock>
        </Card>
      </div>
    );
    
  }
}
function Dashboard({ isActive, setIsActive }) {
}

const enhance = compose(
  withState('isActive', 'setIsActive', false)
);

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchReputation: fetchReputation(dispatch)
  }
}

export default enhance(connect(mapStateToProps, mapDispatchToProps)(Dashboard));





/*
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

 */
