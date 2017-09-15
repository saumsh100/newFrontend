import React, { PropTypes } from 'react';
import { Card, CardHeader, DropdownMenu, Form, Field, Button, LineChart, Icon } from '../../../library';
import styles from './styles.scss';

function PhoneGraph(props) {
  const {
    callGraphStats,
  } = props;

  if (!callGraphStats) {
    return null;
  }

  const x = callGraphStats.toJS().data.xValues;
  const y = callGraphStats.toJS().data.yValues;

  const newY = y.slice(0, -1)

  const UserMenu = buttonProps => (
    <Button flat {...buttonProps} className={styles.userMenuButton}>
      <span className={styles.userRole}><i className="fa fa-calendar" /> {props.startDate.format('MMMM Do YYYY')} - {props.endDate.format('MMMM Do YYYY')}&nbsp;</span>
      <Icon icon="caret-down" />
    </Button>
  );

  const initialValues = {
    endDate: props.endDate._d,
    startDate: props.startDate._d,
  };

  const ticks = {
    fontSize: 16,
    fontFamily: 'Gotham-Medium',
    fontColor: '#2e3845',
    padding: 15,
    maxRotation: 0,
    autoSkip: false,
    callback(value, index) {
      if (typeof value === 'number') {
        if (Number.isSafeInteger(value)) {
          return value;
        }
      }
      if (index % 2 === 0 && typeof value !== 'number' && x.length < 45) {
        return '';
      }

      if (index % 2 !== 0 && x.length < 45 && typeof value !== 'number') {
        return value;
      } else if (x.length > 45 && typeof value !== 'number' && index % 10 === 0) {
        return value;
      }

      return '';
    },
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks,
        gridLines: {
          beginAtZero: true,
          drawTicks: false,
        },
      }],

      xAxes: [{
        ticks,
        gridLines: {
          offsetGridLines: true,
          display: true,
          drawTicks: false,
          drawOnChartArea: false,
        },
      }],
    },
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
              onSubmit={props.submit}
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
          displayTooltips
          labels={x}
          height={240}
          dataSets={[
            {
              label: 'Calls Received',
              color: 'red',
              data: newY,
              fill: false,
            },
          ]}
          options={lineChartOptions}
        />
      </div>
    </Card>
  );
}

PhoneGraph.propTypes = {
  submit: PropTypes.function,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  callGraphStats: PropTypes.object,
};


export default PhoneGraph;
