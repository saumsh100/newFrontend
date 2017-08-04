
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change, reset } from 'redux-form';
import { Button, IconButton, Avatar } from '../../library';
import DisplayForm from './DisplayForm';
import {
  fetchEntities,
  createEntityRequest,
  updateEntityRequest,
  deleteEntityRequest,
} from '../../../thunks/fetchEntities';
import { previewSegment } from '../../../thunks/segments';
import styles from './styles.scss';


class AddSegment extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.formData) {
      this.props.previewSegment(props.formData);
    }
  }
  
  handleSubmit(values) {
    debugger;
  }

  handleAgeChange(value) {
    const {
      formName,
    } = this.props;

    this.props.change(formName, 'age', value);
    return false;
  }

  handleGenderChange(value) {
    const {
      formName,
    } = this.props;

    this.props.change(formName, 'gender', value[0]);
  }

  render() {
    const {
      formName,
      reinitializeState,
    } = this.props;
  
    return (
      <div className={styles.formContainer}>
        <DisplayForm
          key={formName}
          formName={formName}
          selectedSegment={null}
          handleAgeChange={this.handleAgeChange}
          handleGenderChange={this.handleGenderChange}
          handleSubmit={this.handleSubmit}
          formState={this.props.formState}
          age={this.props.formData.age}
          gender={this.props.formData.gender}
          handleCancel={() => {
            this.props.reset(formName);
            return reinitializeState();
          }}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    updateEntityRequest,
    deleteEntityRequest,
    reset,
    change,
    previewSegment,
  }, dispatch);
}


function mapStateToProps(state) {
  return {
    formState: state.form.AddSegment,
    formData: state.form.AddSegment ? state.form.AddSegment.values : {},
  };
}

AddSegment.propTypes = {
  formName: PropTypes.string.isRequired,
  fetchEntities: PropTypes.func,
  updateEntityRequest: PropTypes.func,
  reset: PropTypes.func,
  reinitializeState: PropTypes.func,
  change: PropTypes.func,
  previewSegment: PropTypes.func,
  formState: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}).isRequired,
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddSegment);

/**
 * TODO:
 * - Preview
 * - Apply
 * - Name prompt on save
 * - Save to the database
 */
