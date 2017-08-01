
import React, { PropTypes, Component } from 'react';
import { Grid, Row, Col, Form, FormSection, Tabs, Tab, Pill, SelectPill, InfoSection, DropdownSelect } from '../../library';
import Gauge from './Gauge';
import styles from './styles.scss';

class DisplayForm extends Component {
  constructor(props) {
    super(props);

    this.state = { index: 0 };

    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(index) {
    this.setState({ index });
  }

  render() {
    const {
    formName,
    handleSubmit,
    selectedSegment,
  } = this.props;

    const title = selectedSegment ? 'Edit Segment' : 'Create New Segment';

    return (
      <Form
        form={formName}
        onSubmit={handleSubmit}
        ignoreSaveButton
        initialValues={{}}
        data-test-id="createSegmentForm"
      >
        <Grid className={styles.addNewSegment}>
          <Row className={styles.addNewSegment_mainContainer}>
            <Col xs={9} sm={9} md={9}>
              <div className={styles.title}>{title}</div>
              <FormSection name="filters">
                <Tabs navClass={styles.nav} index={this.state.index} contentClass={styles.tabContent} onChange={this.onTabChange}>
                  <Tab label="Demographics" className={styles.tab} activeClassName={styles.activeTab}>
                    <Grid>
                      <Row>
                        <Col xs={2} sm={2} md={2} className={styles.fieldLabel}>
                          Age
                        </Col>
                        <Col xs={10} sm={10} md={10}>
                          <SelectPill multiselect>
                            <Pill title="0-9" pillId="0-9" />
                            <Pill title="10-17" pillId="10-17" />
                            <Pill title="18-24" pillId="18-24" />
                            <Pill title="25-34" pillId="25-34" />
                            <Pill title="35-44" pillId="35-44" />
                            <Pill title="45-44" pillId="45-44" />
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
                          <SelectPill>
                            <Pill title="Female" pillId="f" />
                            <Pill title="Male" pillId="m" />
                            <Pill title="Unknown" pillId="u" />
                          </SelectPill>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={2} sm={2} md={2} className={styles.fieldLabel}>
                          City
                        </Col>
                        <Col xs={10} sm={10} md={10}>
                          <DropdownSelect
                            align="left"
                            options={[
                              { label: 'Toronto', value: 1 },
                              { label: 'Quebec', value: 2 },
                            ]}
                            onChange={(value) => { console.log(value) ;}}
                          />
                        </Col>
                      </Row>
                    </Grid>
                  </Tab>
                  <Tab label="Behavior" className={styles.tab} activeClassName={styles.activeTab}>
                    <span>Behavior</span>
                  </Tab>
                  <Tab label="Technology" className={styles.tab} activeClassName={styles.activeTab}>
                    <span>Technology</span>
                  </Tab>
                </Tabs>
              </FormSection>
            </Col>
            <Col xs={3} sm={3} md={3}>
              <div className={styles.rightPane}>
                <Gauge
                  percentage={33}
                >
                  of patients
                </Gauge>
                <InfoSection title="12,346">
                  # of patients
                </InfoSection>
                <InfoSection title="121,346">
                  100% of total appointments
                </InfoSection>
              </div>
            </Col>
          </Row>
        </Grid>
      </Form>
    );
  }
}

DisplayForm.propTypes = {
  formName: PropTypes.string.isRequired,
  selectedSegment: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default DisplayForm;
