
import React, { PropTypes } from 'react';

class PatientsContainer extends React.Component {
  componentWillMount() {
    // this.props.fetchEntities({ key: 'patients' });
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

PatientsContainer.propTypes = {};

export default PatientsContainer;
