
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DisplayForm from './DisplayForm';
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
    return this.props.fetchEntities({ url: '/api/patients/search', params:  { patients: value } })
      .then((searchData) => {
        return searchData.patients;
      }).then((searchedPatients) => {
        const results = Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
          (key) => { return searchedPatients[key]; }) : [];
        return results;
    });
  }

  render() {
    const {
      services,
      patients,
      chairs,
      practitioners,
    } = this.props;

    return (
      <DisplayForm
        services={services}
        patients={patients}
        chairs={chairs}
        practitioners={practitioners}
        getSuggestions={this.getSuggestions}
        handleSubmit={this.handleSubmit}
      />
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
