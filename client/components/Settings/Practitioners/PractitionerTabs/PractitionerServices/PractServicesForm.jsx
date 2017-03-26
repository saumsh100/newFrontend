import React, {Component, PropTypes} from 'react';
import PractServicesList from './PractServicesList';
import { Form, Field, Toggle} from '../../../../library';

class PractServicesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allServices: null,
    }
    this.setAllServices = this.setAllServices.bind(this);
    this.handleFieldToggle = this.handleFieldToggle.bind(this);
    this.setAllToggles = this.setAllToggles.bind(this);
  }

  componentWillMount(){
    const { initialValues } = this.props;
    let test = true;
    for (const key of Object.keys(initialValues)) {
          if (!initialValues[key]) {
            test = false;
            break;
          }
    }
    this.setState({ allServices: test })
  }

  setAllServices(event) {
    event.stopPropagation();
    const { allServices } = this.state;

    if (allServices) {
      this.setAllToggles(false);
      this.setState({ allServices: false });
    } else {
      this.setAllToggles(true);
      this.setState({ allServices: true });
    }
  }

  handleFieldToggle(event, newValue, previousValue) {
    const { allServices } = this.state;
    if(!newValue && allServices){
      this.setState({ allServices: false });
    }
  }
  setAllToggles(value) {
    const { services, change, practitioner } = this.props;
    services.map((s) => {
      return change(`${practitioner.get('id')}service`, s.get('id'), value);
    });
  }

  render() {
    const { services, practitioner, initialValues, } = this.props;

    let showComponent = null;

    if (services && this.state.allServices !== null) {
      showComponent = (
        <div>
          <Toggle
            defaultChecked={this.state.allServices}
            value={this.state.allServices}
            onChange={this.setAllServices}
          />
          <Form
            form={`${practitioner.get('id')}service`}
            onSubmit={this.props.handleSubmit}
            initialValues={initialValues}
          >
            {services.toArray().map((service, index) => {
              return (
                <PractServicesList
                  key={`${practitioner.get('id')}${index}`}
                  service={service}
                  handleFieldToggle={this.handleFieldToggle}
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
