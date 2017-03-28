import React, {Component, PropTypes} from 'react';
import { Field } from '../../../../library';

class PractServicesList extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { service, fieldValue, } = this.props;

    let showComponent = null;

    if (fieldValue == null) {
      return null;
    }

    if (service) {
      showComponent = (
        <div>
          {service.get('name')}
          <Field
            component="Toggle"
            name={service.get('id')}
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
