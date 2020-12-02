
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import round from 'lodash/round';

import {
  Grid,
  Row,
  Col,
  Form,
  Tabs,
  Tab,
  Pill,
  SelectPill,
  InfoSection,
  Button,
  Field,
  Summary,
} from '../../library';
import Gauge from './Gauge';
import { fetchCities } from '../../../thunks/segments';

import styles from './styles.scss';

class DisplayForm extends Component {
  constructor(props) {
    super(props);

    this.state = { index: 0 };

    this.onTabChange = this.onTabChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchCities(this.props.enterpriseId);
  }

  onTabChange(index) {
    this.setState({ index });
  }

  calculatePercentage(num, total) {
    if (total === 0) {
      return 100;
    }
    return round((num / total) * 100, 2);
  }

  render() {
    const { formName, handleSubmit, segments, edit } = this.props;

    const title = edit ? 'Edit Segment' : 'Create New Segment';
    return (
      <Grid className={styles.addNewSegment}>
        <Row className={styles.addNewSegment_mainContainer}>
          <Col xs={9} sm={9} md={9} className={styles.formSection}>
            <Form
              form={formName}
              onSubmit={handleSubmit}
              ignoreSaveButton
              initialValues={{
                city: this.props.city || undefined,
              }}
              data-test-id="createSegmentForm"
            >
              <div className={styles.title}>{title}</div>
              <Tabs
                navClass={styles.nav}
                index={this.state.index}
                contentClass={styles.tabContent}
                onChange={this.onTabChange}
              >
                <Tab label="Demographics" className={styles.tab} activeClass={styles.activeTab}>
                  <Grid className={styles.grid}>
                    <Row>
                      <Col xs={2} sm={2} md={2} className={styles.fieldLabel}>
                        Age
                      </Col>
                      <Col xs={10} sm={10} md={10}>
                        <SelectPill
                          multiselect
                          onChange={this.props.handleAgeChange}
                          selected={this.props.age}
                        >
                          <Pill title="0-9" pillId="0-9" />
                          <Pill title="10-17" pillId="10-17" />
                          <Pill title="18-24" pillId="18-24" />
                          <Pill title="25-34" pillId="25-34" />
                          <Pill title="35-44" pillId="35-44" />
                          <Pill title="45-54" pillId="45-54" />
                          <Pill title="55-64" pillId="55-64" />
                          <Pill title="65+" pillId="65+" />
                        </SelectPill>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={2} sm={2} md={2} className={styles.fieldLabel}>
                        Gender
                      </Col>
                      <Col xs={10} sm={10} md={10}>
                        <SelectPill
                          onChange={this.props.handleGenderChange}
                          selected={[this.props.gender]}
                        >
                          <Pill title="Female" pillId="female" />
                          <Pill title="Male" pillId="male" />
                          <Pill title="Unknown" pillId="unknown" />
                        </SelectPill>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={2} sm={2} md={2} className={styles.fieldLabel}>
                        City
                      </Col>
                      <Col xs={10} sm={10} md={10}>
                        <Field
                          component="DropdownSelect"
                          align="left"
                          options={this.props.segments.cities.map(city => ({
                            label: city.city,
                            value: city.city,
                          }))}
                          name="city"
                          borderColor="primaryColor"
                          required
                        />
                      </Col>
                    </Row>
                  </Grid>
                </Tab>
                <Tab label="Behavior" className={styles.tab} activeClass={styles.activeTab}>
                  <span>Coming soon</span>
                </Tab>
                <Tab label="Custom" className={styles.tab} activeClass={styles.activeTab}>
                  <span>Coming soon</span>
                </Tab>
              </Tabs>
            </Form>

            <div className={styles.buttons}>
              <Button flat onClick={this.props.handleApply}>
                Apply
              </Button>
              <Button flat form={formName} onClick={this.props.handleSubmit}>
                Save
              </Button>
              <Button flat onClick={this.props.handleCancel}>
                Cancel
              </Button>
            </div>
          </Col>
          <Col xs={3} sm={3} md={3}>
            <div className={styles.rightPane}>
              {this.props.segments.loading || !this.props.segments.preview ? (
                <Loader loaded={false} color="#FF715A" />
              ) : (
                <div>
                  <Gauge
                    percentage={this.calculatePercentage(
                      segments.preview.segmentActiveUsers,
                      segments.preview.totalActiveUsers,
                    )}
                  >
                    of patients
                  </Gauge>
                  <InfoSection title={segments.preview.segmentActiveUsers || ''}>
                    # of patients
                  </InfoSection>
                  <InfoSection title={segments.preview.segmentAppointments || ''}>
                    {`${this.calculatePercentage(
                      segments.preview.segmentAppointments,
                      segments.preview.totalAppointments,
                    )}% of total appointments`}
                  </InfoSection>
                  <Summary
                    title="Demographics"
                    items={[
                      {
                        label: 'Age',
                        value: this.props.age ? this.props.age.join(', ') : 'All',
                      },
                      {
                        label: 'Gender',
                        value: this.props.gender || 'All',
                      },
                      {
                        label: 'City',
                        value: this.props.city || 'All',
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

DisplayForm.propTypes = {
  formName: PropTypes.string.isRequired,
  handleAgeChange: PropTypes.func,
  handleGenderChange: PropTypes.func,
  age: PropTypes.arrayOf(PropTypes.string),
  gender: PropTypes.string,
  city: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleApply: PropTypes.func.isRequired,
  edit: PropTypes.bool,
  segments: PropTypes.shape({
    preview: PropTypes.shape({}),
    loading: PropTypes.bool,
    cities: PropTypes.arrayOf(
      PropTypes.shape({
        city: PropTypes.string,
      }),
    ),
  }).isRequired,
  enterpriseId: PropTypes.string.isRequired,
  fetchCities: PropTypes.func,
};

DisplayForm.defaultProps = {
  handleAgeChange: () => {},
  handleGenderChange: () => {},
  age: null,
  gender: null,
  city: null,
  edit: null,
  fetchCities: null,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchCities,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    segments: state.segments,
    enterpriseId: state.auth.get('enterprise').get('id'),
  };
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(DisplayForm);
