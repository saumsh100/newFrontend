
import React, { PropTypes } from 'react';

class PatientsContainer extends React.Component {
  componentWillMount() {
    // this.props.fetchEntities({ key: 'patients' });
  }

  render() {
    console.log('RENDERING PATIENT CONTAINER');
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

PatientsContainer.propTypes = {

};

export default PatientsContainer;
