
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { Map } from 'immutable';
import { Form, Field, Toggle, Grid, Row, Col } from '../../../../library/index';
import { updateEntityRequest, createEntityRequest } from '../../../../../thunks/fetchEntities';
import accountShape from '../../../../library/PropTypeShapes/accountShape';
import wordsForTime from './selectConstants';
import { onlyNumber } from '../../../../../components/library/Form/validate';

class ChatSection extends Component {
  constructor(props) {
    super(props);
    const { activeAccount } = this.props;

    this.state = {
      toggle: activeAccount.canAutoRespondOutsideOfficeHours,
      limit: activeAccount.autoRespondOutsideOfficeHoursLimit || false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.changeToggle = this.changeToggle.bind(this);
    this.changeToggleLimit = this.changeToggleLimit.bind(this);
  }

  onSubmit(values) {
    const { activeAccount } = this.props;
    const { toggle, limit } = this.state;
    const data = {
      canAutoRespondOutsideOfficeHours: toggle,
      bufferBeforeOpening:
        (toggle && `${values.bufferBeforeOpeningNum} ${values.bufferBeforeOpeningWord}`) || null,
      bufferAfterClosing:
        (toggle && `${values.bufferAfterClosingNum} ${values.bufferAfterClosingWord}`) || null,
      autoRespondOutsideOfficeHoursLimit:
        (toggle &&
          limit &&
          `${values.autoRespondOutsideOfficeHoursLimitNum} ${
            values.autoRespondOutsideOfficeHoursLimitWord
          }`) ||
        null,
    };

    const valuesMap = Map(data);
    const modifiedAccount = activeAccount.merge(valuesMap);

    const alert = {
      success: { body: 'Updated Practice Information' },
      error: {
        title: 'Practice Information Error',
        body: 'Failed to update.',
      },
    };

    this.props.updateEntityRequest({
      key: 'accounts',
      model: modifiedAccount,
      alert,
    });
  }

  changeToggle() {
    this.setState(
      ({ toggle }) => ({ toggle: !toggle }),
      () => this.props.change('chatSettingsForm', 'bufferBeforeOpening', this.state.toggle ? 1 : 0),
    );
  }

  changeToggleLimit() {
    this.setState(
      ({ limit }) => ({ limit: !limit }),
      () => this.props.change('chatSettingsForm', 'bufferBeforeOpening', this.state.toggle ? 1 : 0),
    );
  }

  initialValues() {
    const {
      activeAccount,
      bufferBeforeOpening,
      bufferAfterClosing,
      autoRespondOutsideOfficeHoursLimit,
    } = this.props;
    const [numOpen, wordOpen] = bufferBeforeOpening.split(' ');
    const [numAfter, wordAfter] = bufferAfterClosing.split(' ');
    const [numLimit, wordLimit] = autoRespondOutsideOfficeHoursLimit.split(' ');

    return {
      canAutoRespondOutsideOfficeHours: activeAccount.get('canAutoRespondOutsideOfficeHours'),
      bufferBeforeOpeningNum: numOpen,
      bufferBeforeOpeningWord: wordOpen,
      bufferAfterClosingNum: numAfter,
      bufferAfterClosingWord: wordAfter,
      autoRespondOutsideOfficeHoursLimitNum: numLimit,
      autoRespondOutsideOfficeHoursLimitWord: wordLimit,
    };
  }

  render() {
    return (
      <Form
        enableReinitialize
        form="chatSettingsForm"
        onSubmit={this.onSubmit}
        initialValues={this.initialValues()}
        data-test-id="chatSettingsForm"
      >
        <div>
          <Grid>
            <Row>
              <Col xs={9}>
                <span>Communication Outside Buffer</span>
              </Col>
              <Col xs={3}>
                <Toggle
                  data-test-id="toggle_buffer"
                  checked={this.state.toggle}
                  onChange={this.changeToggle}
                />
              </Col>
            </Row>
          </Grid>
          {this.state.toggle && (
            <Grid>
              <Row>
                <Col xs={3}>
                  <Field
                    required
                    type="number"
                    name="bufferBeforeOpeningNum"
                    label="Before"
                    validate={[onlyNumber]}
                    data-test-id="bufferBeforeOpeningNum"
                  />
                </Col>
                <Col xs={9}>
                  <Field
                    name="bufferBeforeOpeningWord"
                    component="DropdownSelect"
                    options={wordsForTime}
                    data-test-id="bufferBeforeOpeningWord"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                  <Field
                    required
                    type="number"
                    name="bufferAfterClosingNum"
                    label="After"
                    validate={[onlyNumber]}
                    data-test-id="bufferAfterClosingNum"
                  />
                </Col>
                <Col xs={9}>
                  <Field
                    name="bufferAfterClosingWord"
                    component="DropdownSelect"
                    options={wordsForTime}
                    data-test-id="bufferAfterClosingWord"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={9}>
                  <span>Limit the outside office hours responses</span>
                </Col>
                <Col xs={3}>
                  <Toggle
                    data-test-id="toggle_limit"
                    checked={this.state.limit}
                    onChange={this.changeToggleLimit}
                  />
                </Col>
              </Row>
              {this.state.limit && (
                <Row>
                  <Col xs={3}>
                    <Field
                      type="number"
                      name="autoRespondOutsideOfficeHoursLimitNum"
                      label="Limit"
                      validate={[onlyNumber]}
                      data-test-id="autoRespondOutsideOfficeHoursLimitNum"
                    />
                  </Col>
                  <Col xs={9}>
                    <Field
                      name="autoRespondOutsideOfficeHoursLimitWord"
                      component="DropdownSelect"
                      options={wordsForTime}
                      data-test-id="autoRespondOutsideOfficeHoursLimitWord"
                    />
                  </Col>
                </Row>
              )}
            </Grid>
          )}
        </div>
      </Form>
    );
  }
}

ChatSection.propTypes = {
  activeAccount: PropTypes.shape(accountShape).isRequired,
  bufferBeforeOpening: PropTypes.string.isRequired,
  bufferAfterClosing: PropTypes.string.isRequired,
  autoRespondOutsideOfficeHoursLimit: PropTypes.string.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
};

function mapDispatchToActions(dispatch) {
  return bindActionCreators(
    {
      change,
      updateEntityRequest,
      createEntityRequest,
    },
    dispatch,
  );
}

function mapStateToProps(state, { activeAccount }) {
  return {
    canAutoRespondOutsideOfficeHours: activeAccount.get('canAutoRespondOutsideOfficeHours'),
    bufferBeforeOpening: activeAccount.get('bufferBeforeOpening') || '0 minutes',
    bufferAfterClosing: activeAccount.get('bufferAfterClosing') || '0 minutes',
    autoRespondOutsideOfficeHoursLimit:
      activeAccount.get('autoRespondOutsideOfficeHoursLimit') || '0 minutes',
  };
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToActions,
);

export default enhance(ChatSection);
