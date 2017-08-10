import React, { PropTypes, Component } from 'react';
import { Card, CardHeader, DropdownMenu, Form, Field, Button, LineChart, Icon } from '../../../library';
import styles from './styles.scss';


class PhoneGraph extends Component {
  render() {
    const {
      callGraphStats,
    } = this.props;

    if (!callGraphStats) {
      return null;
    }

    const x = callGraphStats.toJS().data.xValues;
    const y = callGraphStats.toJS().data.yValues;

    const UserMenu = props => (
      <Button flat {...props} className={styles.userMenuButton}>
        <span className={styles.userRole}><i className="fa fa-calendar" /> {this.props.startDate.format('MMMM Do YYYY')} - {this.props.endDate.format('MMMM Do YYYY')}&nbsp;</span>
        <Icon icon="caret-down" />
      </Button>
      );

    const initialValues = {
      endDate: this.props.endDate._d,
      startDate: this.props.startDate._d,
    };

    return (
      <Card className={styles.booked} >
        <div className={styles.booked__header}>
          <CardHeader title="Calls" />
          <div
            className={styles.floatRight}
          >
            <DropdownMenu
              labelComponent={UserMenu}
              closeOnInsideClick={false}
            >
              <Form
                className={styles.formDrop}
                form="dates"
                onSubmit={this.props.submit}
                initialValues={initialValues}
                data-test-id="dates"
              >
                <Field
                  required
                  component="DayPicker"
                  name="startDate"
                  label="Start Date"
                />
                <Field
                  required
                  component="DayPicker"
                  name="endDate"
                  label="End Date"
                />
              </Form>
            </DropdownMenu>
          </div>
        </div>
        <div className={`${styles.booked__body} col-md-4`}>
          <LineChart
            displayTooltips={true}
            labels={x}
            height={80}
            dataSets={[
              {
                label: 'Calls Received',
                color: 'red',
                data: y,
              },
            ]}
          />
        </div>
      </Card>
    );
  }
}

PhoneGraph.propTypes = {
  submit: PropTypes.function,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  callGraphStats: PropTypes.object,
};


export default PhoneGraph;
