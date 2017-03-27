import React, {Component, PropTypes} from 'react';
import PractServicesList from './PractServicesList';
import { Form, Field, Toggle} from '../../../../library';

function checkValues(obj) {
  let value = true;
  for (const key of Object.keys(obj)) {
        if (!obj[key]) {
          value = false;
          break;
        }
  }
  return value;
}

class PractServicesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allServices: null,
      fieldValues: {},
    }
    this.setAllServices = this.setAllServices.bind(this);
    this.handleFieldToggle = this.handleFieldToggle.bind(this);
    this.setAllToggles = this.setAllToggles.bind(this);
    this.setFieldValues = this.setFieldValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { initialValues } = this.props;
    const value = checkValues(initialValues);

    this.setState({
      allServices: value,
      fieldValues: initialValues,
    });
  }

  handleSubmit(values) {
    this.props.handleSubmit(this.state.fieldValues);
  }

  handleFieldToggle(serviceId, newValue) {
    const { allServices, fieldValues } = this.state;

    let tempObj = fieldValues
    tempObj[serviceId] = newValue;

    if (!newValue && allServices) {
      this.setState({ allServices: false, fieldValues: tempObj });
    } else if (newValue && !allServices) {
      const value = checkValues(tempObj);
      this.setState({ allServices: value, fieldValues: tempObj });
    } else {
      this.setState({ fieldValues: fieldValues})
    }
  }

  setAllServices(event) {
    const { allServices } = this.state;

    if (allServices) {
      this.setState({
        allServices: false,
        fieldValues: this.setFieldValues(false)
      });
    } else {
      this.setState({
        allServices: true,
        fieldValues: this.setFieldValues(true)
      });
    }

  }

  setAllToggles(value) {
    const { services, change, practitioner } = this.props;
    const { fieldValues } = this.state;

    services.map((s) => {
      return change(`${practitioner.get('id')}service`, s.get('id'), value);
    });
  }

  setFieldValues(value) {
    const { fieldValues } = this.state;
    let tempObj = fieldValues;
    for (const key of Object.keys(tempObj)) {
      tempObj[key] = value;
    }
    return tempObj;
  }

  render() {
    const { services, practitioner, initialValues } = this.props;
    const { fieldValues } = this.state;
    let showComponent = null;

    if (services ) {
      showComponent = (
        <div>
          <Form
            form={`${practitioner.get('id')}service`}
            onSubmit={this.handleSubmit}
            initialValues={initialValues}
          >
            <Field
              component="Toggle"
              name="allServices"
              onChange={this.setAllServices}
              checked={this.state.allServices}
            />
            {services.toArray().map((service, index) => {
              return (
                <PractServicesList
                  key={`${practitioner.get('id')}${index}`}
                  service={service}
                  handleFieldToggle={this.handleFieldToggle}
                  fieldValue={fieldValues[service.get('id')]}
                />
              );
            })}
          </Form>
        </div>
      )
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }
}

export default PractServicesForm;
