import React, {Component, PropTypes} from 'react';
import { Field } from '../../../library';

class PractServicesList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { service } = this.props;

    if (!service) {
      return null;
    }

    return (
      <div>
        {service.get('name')}
        <Field component="Toggle" name={service.get('id')} />
      </div>
    );
  }

}

export default PractServicesList;