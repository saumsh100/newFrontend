
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  VButton,
  Modal,
  DropdownSelect,
  DropdownMenu,
} from '../../library';
import withAuthProps from '../../../hocs/withAuthProps';
import { removeApplied, applySegment } from '../../../actions/segments';
import styles from './enterprise-page.scss';
import AddSegment from "../AddSegment";
import DateRangeCompare from '../DateRangeCompare';
import { fetchEntities } from '../../../thunks/fetchEntities';

class EnterprisePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addSegment: false,
      edit: false,
    };

    this.addSegment = this.addSegment.bind(this);
    this.editSegment = this.editSegment.bind(this);
    this.removeApplied = this.removeApplied.bind(this);
    this.applyDateRange = this.applyDateRange.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'segments', url: '/api/segments/' });
  }

  reinitializeState() {
    this.setState({
      ...this.state,
      addSegment: false,
    });
  }

  addSegment() {
    this.setState({
      ...this.state,
      addSegment: true,
    });
  }

  editSegment() {
    this.setState({
      ...this.state,
      addSegment: true,
      edit: true,
    });
    Object.keys(this.props.rawWhere).forEach((key) => {
      this.props.change('AddSegment', key, this.props.rawWhere[key]);
    });
  }

  removeApplied() {
    this.props.removeApplied();
  }

  applyDateRange(values) {
    window.alert(JSON.stringify(values));
  }

  render() {
    const { addSegment } = this.state;

    const displayModalComponent = (
      <AddSegment
        edit={this.state.edit}
        formName="AddSegment"
        reinitializeState={this.reinitializeState}
        addSegmentName={this.addSegmentName}
      />
    );

    // Does this need to be a function?
    const DateRangeTarget = (props) => (
      <VButton
        {...props}
        title="Date Range"
        compact
        className={styles['btn-add-segment']}
        color="white"
      />
    );

    return (
      <div>
        <Row className={styles.header}>
          <Col md={8}>{null /* TODO: sub navigation */}</Col>

          <Col md={4} className={styles['header-title']}>
            Enterprise
          </Col>
        </Row>

        <div className={styles['page-container']}>
          <Row middle="md" className={styles['filter-container']}>
            {!this.props.applied ? (
              <Col md={6}>
                <h1 className={styles['page-title']}>Patients</h1>
                <VButton
                  title="Add Segment"
                  compact
                  className={styles['btn-add-segment']}
                  color="darkgrey"
                  onClick={this.addSegment}
                />
                <DropdownSelect
                  className={styles.dropdown}
                  align="left"
                  options={this.props.segments.toArray().map((segment) => ({
                    label: segment.name,
                    value: segment,
                  }))}
                  name="city"
                  value=""
                  required
                  onChange={(segment) => {
                    this.props.applySegment(segment);
                  }}
                />
              </Col>
            ) : (
              <Col md={6}>
                <h1 className={styles['page-title']}>Patients</h1>
                <VButton
                  title={`Segment Applied ${
                    this.props.segmentName !== ''
                      ? `(${this.props.segmentName})`
                      : ''
                  }`}
                  compact
                  className={styles['btn-add-segment']}
                  color="white"
                  icon="close"
                  onClick={this.removeApplied}
                />
                <VButton
                  title="Edit Segment"
                  compact
                  className={styles['btn-add-segment']}
                  color="darkgrey"
                  onClick={this.editSegment}
                />
              </Col>
            )}

            {/* TODO: Implement ButtonDropDown element */}

            <Col md={6}>
              <DropdownMenu
                labelComponent={DateRangeTarget}
                closeOnInsideClick={false}
                className={styles.dateRangeMenu}
              >
                <DateRangeCompare onSubmit={this.applyDateRange} />
              </DropdownMenu>
            </Col>
          </Row>

          <div>{this.props.children}</div>
          <Modal
            active={addSegment}
            onEscKeyDown={this.reinitializeState}
            onOverlayClick={this.reinitializeState}
            custom
            className={styles.modal}
          >
            {displayModalComponent}
          </Modal>
        </div>
      </div>
    );
  }
}

EnterprisePage.propTypes = {
  children: PropTypes.node.isRequired,
  applied: PropTypes.bool.isRequired,
  rawWhere: PropTypes.shape({}).isRequired,
  removeApplied: PropTypes.func,
  change: PropTypes.func,
  fetchEntities: PropTypes.func,
  applySegment: PropTypes.func,
  segments: PropTypes.shape({
    toArray: PropTypes.func,
  }).isRequired,
  segmentName: PropTypes.string,
};

const stateToProps = (state) => ({
  applied: state.segments.applied,
  rawWhere: state.segments.rawWhere,
  segments: state.entities.get('segments').get('models'),
  segmentName: state.segments.name,
});

const actionsToProps = (dispatch) =>
  bindActionCreators(
    {
      removeApplied,
      change,
      applySegment,
      fetchEntities,
    },
    dispatch,
  );

export default withAuthProps(connect(
  stateToProps,
  actionsToProps,
)(EnterprisePage));
