
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
import styles from './styles.scss';


class AddSegment extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
  }
  
  handleSubmit() {
    
  }

  handleAgeChange(value) {
    const {
      formName,
    } = this.props;

    this.props.change(formName, 'age', Object.keys(value));
  }

  handleGenderChange(value) {
    const {
      formName,
    } = this.props;

    this.props.change(formName, 'gender', Object.keys(value)[0]);
  }

  render() {
    const {
      formName,
      reinitializeState,
    } = this.props;
  
    return (
      <div className={styles.formContainer}>
        <IconButton
          icon="times"
          onClick={() => {
            this.props.reset(formName);
            return reinitializeState();
          }}
          className={styles.trashIcon}
        />
        <DisplayForm
          key={formName}
          formName={formName}
          selectedSegment={null}
          handleAgeChange={this.handleAgeChange}
          handleGenderChange={this.handleGenderChange}
          handleSubmit={this.handleSubmit}
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
  }, dispatch);
}


function mapStateToProps() {
  return {};
}

AddSegment.propTypes = {
  formName: PropTypes.string.isRequired,
  fetchEntities: PropTypes.func,
  updateEntityRequest: PropTypes.func,
  reset: PropTypes.func,
  reinitializeState: PropTypes.func,
  change: PropTypes.func,
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddSegment);
