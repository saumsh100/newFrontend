
import React, { PropTypes, Component } from 'react';
import { Grid, Row, Col, Form, FormSection, Tabs, Tab } from '../../library';
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
            <Col xs={10} sm={10} md={10}>
              <div className={styles.title}>{title}</div>
              <FormSection name="filters">
                <Tabs navClass={styles.nav} index={this.state.index} contentClass={styles.tabContent} onChange={this.onTabChange}>
                  <Tab label="Demographics" className={styles.tab} activeClassName={styles.activeTab}>
                    <span>Demographics</span>
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
            <Col xs={2} sm={2} md={2}>
              <FormSection name="patient" />
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
