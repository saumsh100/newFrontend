import React, {Component, PropTypes} from 'react';
import PractServicesList from './PractServicesList';
import { Form, Field, Toggle} from '../../../../library';
import { connect } from 'react-redux';

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
    }
    this.setAllServices = this.setAllServices.bind(this);
    this.handleFieldToggle = this.handleFieldToggle.bind(this);
    this.setFieldValues = this.setFieldValues.bind(this);
  }

  componentWillMount() {
    const { initialValues } = this.props;
    const value = checkValues(initialValues);
    this.setState({
      allServices: value,
      fieldValues: initialValues,
    });
  }


  handleFieldToggle(serviceId, newValue) {
    const { allServices } = this.state;
    const { values } = this.props;

    values[serviceId] = newValue;

    if (!newValue && allServices) {
      this.setState({ allServices: false });
    } else if (newValue && !allServices) {
      const value = checkValues(values);
      this.setState({ allServices: value });
    }
  }

  setAllServices(e) {
    e.stopPropagation();
    const { allServices, values } = this.state;

    this.setFieldValues(!allServices)
      this.setState({
        allServices: !allServices,
      });
  }

  setFieldValues(value) {
    const { values } = this.props;
    let tempObj = values;
    for (const key of Object.keys(tempObj)) {
      if(key !== "allServices"){
        tempObj[key] = value;
      }
    }
    return tempObj;
  }

  render() {
    const { services, practitioner, initialValues, formName, values } = this.props;
    const { fieldValues } = this.state;

    let showComponent = null;

    if (services) {
      showComponent = (
        <div>
          <div>All Services</div>
            <Toggle
              name="allServices"
              value={this.state.allServices}
              onChange={this.setAllServices}
              checked={this.state.allServices}
            />
          <Form
            form={formName}
            onSubmit={this.props.handleSubmit}
            initialValues={initialValues}
          >
            {services.toArray().map((service, index) => {
              return (
                <PractServicesList
                  key={`${practitioner.get('id')}${index}`}
                  service={service}
                  handleFieldToggle={this.handleFieldToggle}
                  fieldValue={values[service.get('id')]}
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

function mapStateToProps({ form }, { formName }) {

  // form data is populated when component renders
  if (!form[formName]) {
    return {
      values: {},
    };
  }

  return {
    values: form[formName].values,
  };
}

export default connect(mapStateToProps, null)(PractServicesForm);
