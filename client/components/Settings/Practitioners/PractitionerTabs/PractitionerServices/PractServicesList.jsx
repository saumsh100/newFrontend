import React, {Component, PropTypes} from 'react';
import { Field } from '../../../../library';

class PractServicesList extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const { service } = this.props;

    let showComponent = null;

    if (service) {
      showComponent = (
        <div>
          {service.get('name')}
          <Field component="Toggle" name={service.get('id')} onChange={this.props.handleFieldToggle}/>
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
