import React, {Component, PropTypes} from 'react';
import PractServicesList from './PractServicesList';
import { Form, Field,} from '../../../../library';

class PractServicesForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAllServices = this.setAllServices.bind(this);
  }

  handleSubmit(values) {
    const { practitioner, updatePractitioner } = this.props;
    const storeServiceIds = [];

    for (let id in values) {
      if (values[id]) {
        storeServiceIds.push(id);
      }
    }
    const modifiedPractitioner = practitioner.set('services', storeServiceIds);
    updatePractitioner(modifiedPractitioner);
  }

  setAllServices(event, newValue, previousValue) {
    const { services, change, practitioner } = this.props;
    if (newValue) {
      console.log(newValue);
      services.map((s) =>{
        change(`${practitioner.get('id')}service`, s.get('id'), newValue);
      });
    }
  }

  render() {
    const { services, practitioner, initialValues } = this.props;

    if(!services) {
      return null;
    }
    return (
      <Form form={`${practitioner.get('id')}service`} onSubmit={this.handleSubmit} initialValues={initialValues}>
          All Services
          <Field
            component="Toggle"
            name="allServices"
            onChange={this.setAllServices}
          />
        {services.toArray().map((service, index) => {
          return (
            <PractServicesList
              key={`${practitioner.get('id')}${index}`}
              service={service}
            />
          );
        })}
      </Form>
    )
  }
}

export default PractServicesForm;
