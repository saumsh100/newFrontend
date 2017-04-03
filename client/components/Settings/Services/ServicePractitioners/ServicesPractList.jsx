import React, {Component, PropTypes} from 'react';
import { Field } from '../../../library';

class ServicesPractList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { practitioner, fieldValue } = this.props;

    let showComponent = null;

    showComponent = (
      <div>
        {practitioner.getFullName()}
        <Field
          component="Toggle"
          name={practitioner.get('id')}
        />
      </div>
    );

    return (
    <div>
      {showComponent}
    </div>
    );
  }

}

export default ServicesPractList;
