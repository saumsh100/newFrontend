
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change, reset } from 'redux-form';
import { Modal, Input, Row, Col, Grid, Button, IconButton } from '../../library';
import DisplayForm from './DisplayForm';
import {
  fetchEntities,
  createEntityRequest,
  updateEntityRequest,
  deleteEntityRequest,
} from '../../../thunks/fetchEntities';
import {
  applySegment,
} from '../../../actions/segments';
import { previewSegment } from '../../../thunks/segments';
import styles from './styles.scss';

class AddSegment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addSegmentName: false,
      name: '',
    };

    this.addSegmentName = this.addSegmentName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.saveSegment = this.saveSegment.bind(this);
  }

  componentDidMount() {
    this.props.previewSegment({});
  }

  componentWillReceiveProps(props) {
    if (JSON.stringify(this.props.formData) !== JSON.stringify(props.formData)) {
      this.props.previewSegment(props.formData);
      this.closeNameinput = this.closeNameinput.bind(this);
    }
  }
  
  handleApply() {
    this.props.applySegment(this.props.formData);
    this.props.reinitializeState();
    this.props.reset(this.props.formName);
  }

  handleSubmit() {
    this.addSegmentName();
  }

  saveSegment() {
    this.props.createEntityRequest({
      key: 'segments',
      entityData: {
        rawWhere: this.props.formData,
        name: this.state.name,
      },
      url: '/_api/segments/' });
    this.props.reinitializeState();
    this.closeNameinput();
    this.props.reset(this.props.formName);
  }

  addSegmentName() {
    console.log(this.state);
    this.setState({
      ...this.state,
      addSegmentName: true,
    });
  }

  closeNameinput() {
    this.setState({
      ...this.state,
      addSegmentName: false,
      name: '',
    });
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

    this.props.change(formName, 'gender', value[0] || null);
  }

  render() {
    const {
      formName,
      reinitializeState,
    } = this.props;
  
    return (
      <div className={styles.formContainer}>
        <DisplayForm
          edit={this.props.edit}
          key={formName}
          formName={formName}
          selectedSegment={null}
          handleAgeChange={this.handleAgeChange}
          handleGenderChange={this.handleGenderChange}
          handleSubmit={this.handleSubmit}
          age={this.props.formData.age}
          gender={this.props.formData.gender}
          city={this.props.formData.city}
          handleApply={this.handleApply}
          handleCancel={() => {
            this.props.reset(formName);
            return reinitializeState();
          }}
        
        />
        <Modal
          active={this.state.addSegmentName}
          onEscKeyDown={this.closeNameinput}
          onOverlayClick={this.closeNameinput}
          custom
          className={styles.modal}
          showOverlay={false}
        >
          <div className={styles.addSegmentName}>
            <IconButton
              icon="times"
              onClick={() => {
                this.closeNameinput();
              }}
              className={styles.trashIcon}
            />
            <div className={styles.title}>Enter segment name</div>
            <Grid>
              <Row className={styles.addSegmentNameRow}>
                <Col xs={9} sm={9} md={9}>
                  <Input
                    placeholder="Name"
                    value={this.state.name}
                    classStyles={styles.addSegmentNameInput}
                    onChange={(event) => {
                      this.setState({
                        ...this.state,
                        name: event.target.value,
                      });
                    }}
                  />
                </Col>
                <Col xs={2} sm={2} md={2}>
                  <Button
                    onClick={this.saveSegment}
                  >Save</Button>
                </Col>
              </Row>
            </Grid>
          </div>
        </Modal>
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
    applySegment,
  }, dispatch);
}


function mapStateToProps(state) {
  return {
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
  applySegment: PropTypes.func,
  previewSegment: PropTypes.func,
  addSegmentName: PropTypes.func,
  createEntityRequest: PropTypes.func,
  edit: PropTypes.bool,
  formData: PropTypes.shape({
    age: PropTypes.arrayOf(PropTypes.string),
    gender: PropTypes.string,
    city: PropTypes.string,
  }).isRequired,
  
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddSegment);

/**
 * TODO:
 * - Segment dropdown
 * - Edit segment
 */
