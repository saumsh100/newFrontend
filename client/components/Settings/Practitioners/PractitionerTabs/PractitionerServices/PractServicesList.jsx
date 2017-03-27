import React, {Component, PropTypes} from 'react';
import { Field } from '../../../../library';

class PractServicesList extends Component {
  constructor(props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event, newValue, previousValue) {
    const { service } = this.props;
    this.props.handleFieldToggle(service.get('id'), newValue);
  }

  render() {
    const { service, fieldValue} = this.props;
    let showComponent = null;

    if(fieldValue == null){
      return null;
    }
    
    if (service) {
      showComponent = (
        <div>
          {service.get('name')}
          <Field
            component="Toggle"
            name={service.get('id')}
            onChange={this.handleToggle}
            checked={fieldValue}
          />
        </div>
      );
    }
    return (
    <div>
      {showComponent}
    </div>
    );
  }

}

export default PractServicesList;
