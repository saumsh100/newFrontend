import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, VButton, Modal } from '../../library';
import styles from './enterprise-page.scss';
import AddSegment from '../AddSegment/';

class EnterprisePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addSegment: false,
    };

    this.addSegment = this.addSegment.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  reinitializeState() {
    this.setState({
      addSegment: false,
    });
  }

  addSegment() {
    console.log(this.state);
    this.setState({
      addSegment: true,
    });
  }

  render() {
    const {
      addSegment,
    } = this.state;

    const displayModalComponent = (
      <AddSegment
        formName="AddSegment"
        reinitializeState={this.reinitializeState}
      />
    );

    return (<div>
      <Row className={styles.header}>
        <Col md={8}>
          { null /* TODO: sub navigation */ }
        </Col>

        <Col md={4} className={styles['header-title']}>
        Enterprise
      </Col>
      </Row>

      <div className={styles['page-container']}>

        <Row middle="md" className={styles['filter-container']}>
          <Col md={6}>
            <h1 className={styles['page-title']}>Patients</h1>
            <VButton
              title="Add Segment"
              compact className={styles['btn-add-segment']}
              color="darkgrey"
              onClick={this.addSegment}
            />
          </Col>
          { /* TODO: Implement ButtonDropDown element */ }
          { /* <Col md={6} className={styles['filter-buttons']} >
          <VButton title="Save" color="red" compact />
          <VButton title="Clear" compact />
        </Col> */}
        </Row>

        <div>
          { this.props.children }
        </div>
        <Modal
          active={addSegment}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          custom
          className={styles.modal}
        >
          {displayModalComponent}
        </Modal>
      </div>
    </div>);
  }
}

EnterprisePage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EnterprisePage;
