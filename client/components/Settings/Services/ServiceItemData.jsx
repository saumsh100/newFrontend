import React, {Component, PropTypes } from 'react';
import { Row, Col, Form, Grid, Field, IconButton } from '../../library';
import styles from './styles.scss';
import { Map } from 'immutable';


class ServiceItemData extends Component {
  constructor(props){
    super(props)
    this.updateService = this.updateService.bind(this);
    this.isNumber = this.isNumber.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(values){
    const { service } = this.props
    const valuesMap = Map(values);
    const modifiedService = service.merge(valuesMap);
    this.props.onSubmit(modifiedService);
  }

  deleteService(){
    const { service } = this.props
    this.props.deleteService(service.get('id'));
  }

  isNumber(value){
    return value && !/\D/.test(value) ? undefined : 'Please enter a proper value.';
  }

  render() {
    const { service, index } = this.props;

    const initialValues = {
      name: service.get('name'),
      duration: service.get('duration'),
      unitCost: service.get('unitCost'),
      bufferTime: service.get('bufferTime'),
    };

    return (
      <Row>
        <Col xs={6}>
          <Form form={`${index}Form`}
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
                    validate={[this.isNumber]}
                  />
                </Col>
              </Row>
              <Row className={styles.servicesFormRow}>
                <Col xs={12}>
                  <Field
                    required
                    name="unitCost"
                    label="Unit Costs"
                    validate={[this.isNumber]}
                  />
                </Col>
              </Row>
              <Row className={styles.servicesFormRow}>
                <Col xs={12}>
                  <Field
                    required
                    name="bufferTime"
                    label="Buffer Time"
                    validate={[this.isNumber]}
                  />
                </Col>
              </Row>
            </Grid>
          </Form>
        </Col>
        <Col xs={6}>
          <IconButton icon="trash-o" className={styles.trashIcon} onClick={this.deleteService} />
        </Col>
      </Row>
    );
  }
}

export default ServiceItemData;
