import React, {Component, PropTypes } from 'react';
import { Row, Col, Form, Grid, Field, IconButton } from '../../library';
import styles from './styles.scss';
import { Map } from 'immutable';

function isNumber(value){
  return value && !/\D/.test(value) ? undefined : 'Please enter a number.';
}

class ServiceItemData extends Component {
  constructor(props){
    super(props)
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(values) {
    const { service } = this.props;
    const valuesMap = Map(values);
    const modifiedService = service.merge(valuesMap);
    this.props.onSubmit(modifiedService);
  }

  deleteService() {
    const { service } = this.props;
    this.props.deleteService(service.get('id'));
  }

  render() {
    const { service } = this.props;

    if(!service) {
      return null;
    }

    const initialValues = {
      name: service.get('name'),
      duration: service.get('duration'),
      bufferTime: service.get('bufferTime'),
    };

    return (
      <Row>
        <Col xs={6}>
          <Form
            form={`${service.get('id')}Form`}
            onSubmit={this.updateService}
            initialValues={initialValues}
            className={styles.servicesForm}
          >
            <Grid className={styles.servicesFormGrid}>
              <Row className={styles.servicesFormRow}>
                <Col xs={12}>
                  <Field
                    required
                    name="name"
                    label="Name"
                  />
                </Col>
              </Row>
              <Row className={styles.servicesFormRow}>
                <Col xs={12}>
                  <Field
                    required
                    name="duration"
                    label="Duration"
                    validate={[isNumber]}
                  />
                </Col>
              </Row>
              <Row className={styles.servicesFormRow}>
                <Col xs={12}>
                  <Field
                    required
                    name="bufferTime"
                    label="Buffer Time"
                    validate={[isNumber]}
                  />
                </Col>
              </Row>
            </Grid>
          </Form>
        </Col>
        <Col xs={6}>
          <IconButton icon="trash-o" className={styles.trashButton} onClick={this.deleteService} />
        </Col>
      </Row>
    );
  }
}

export default ServiceItemData;
