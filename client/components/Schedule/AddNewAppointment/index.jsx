
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DisplayForm from './DisplayForm';
import styles from './styles.scss';
import { fetchEntities } from '../../../thunks/fetchEntities';

class AddNewAppointment extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  handleSubmit(values) {
    console.log(values);
  }

  getSuggestions(value) {

  }

  render() {
    const {
      services,
      patients,
      chairs,
      practitioners,
    } = this.props;

    return (
      <div className={styles.formContainer}>
        <DisplayForm
          handleSubmit={this.handleSubmit}
          services={services}
          patients={patients}
          chairs={chairs}
          practitioners={practitioners}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(AddNewAppointment);
