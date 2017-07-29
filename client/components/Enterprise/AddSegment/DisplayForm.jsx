
import React, { PropTypes, Component } from 'react';
import { Grid, Row, Col, Form, FormSection, Tabs, Tab, Pill, SelectPill } from '../../library';
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
                    <SelectPill>
                      <Pill title="0 - 9" pillId="0-9" />
                      <Pill title="10 - 17" pillId="10-17" />
                    </SelectPill>
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
