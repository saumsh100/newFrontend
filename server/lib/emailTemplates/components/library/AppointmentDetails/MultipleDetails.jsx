
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Item } from 'react-html-email';
import { dateFormatter, sortAsc } from '@carecru/isomorphic';
import SpaceTable from '../SpaceTable';
import Bold from '../Bold';
import Row from '../Row';
import ItemCol from '../ItemCol';

export default function MultipleDetails(props) {
  const { familyMembers, timezone } = props;

  const headerStyle = {
    textAlign: 'center',
    color: '#808081',
    fontSize: 14,
    textDecoration: 'none',
    fontWeight: 600,
  };

  const titleStyle = {
    color: '#808081',
    fontSize: 14,
    textDecoration: 'none',
  };

  const bgColor = { backgroundColor: '#f1f1f1' };

  const textStyle = {
    textAlign: 'center',
    ...titleStyle,
  };

  // eslint-disable-next-line react/prop-types
  const AppDetailComponent = ({ appointment, patient }) => (
    <Box width="100%" style={bgColor}>
      <Item style={headerStyle}>
        {patient.firstName} {patient.lastName}
      </Item>
      <Item>
        <SpaceTable height={10} />
      </Item>
      <Item style={titleStyle} align="center">
        <Box width="100%" align="center">
          <Row>
            <ItemCol style={textStyle}>
              Date: <Bold>{dateFormatter(appointment.startDate, timezone, 'MMMM Do YYYY')}</Bold>
            </ItemCol>
          </Row>
        </Box>
      </Item>
      <Item style={titleStyle}>
        <SpaceTable height={5} />
        <Box width="100%" align="center">
          <Row>
            <ItemCol style={textStyle}>
              Time: <Bold>{dateFormatter(appointment.startDate, timezone, 'h:mm a')}</Bold>
            </ItemCol>
          </Row>
        </Box>
      </Item>
      <Item>
        <SpaceTable height={20} />
      </Item>
    </Box>
  );

  return (
    <Box width="100%" style={bgColor}>
      <Item>
        <SpaceTable height={20} />
      </Item>
      <Item style={headerStyle}>Appointment Details</Item>
      <Item>
        <SpaceTable height={20} />
      </Item>
      <Item>
        {familyMembers
          .sort(({ appointment: { startDate: a } }, { appointment: { startDate: b } }) =>
            sortAsc(a, b))
          .map((patient, index) => (
            <AppDetailComponent
              key={`patientDetail_${patient.id + index}`}
              appointment={patient.appointment}
              patient={patient}
            />
          ))}
      </Item>
    </Box>
  );
}

MultipleDetails.propTypes = {
  familyMembers: PropTypes.arrayOf(PropTypes.shape({
    patient: {
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    },
    appointment: { startDate: PropTypes.string },
  })).isRequired,
  timezone: PropTypes.string.isRequired,
};
