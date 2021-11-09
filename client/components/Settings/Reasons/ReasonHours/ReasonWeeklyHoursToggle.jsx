import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import CreateReasonWeeklyHours from '../../../GraphQL/ReasonHours/createReasonWeeklyHours';
import DeleteReasonWeeklyHours from '../../../GraphQL/ReasonHours/deleteReasonWeeklyHours';

const ReasonWeeklyHoursToggle = ({ children, id }) => (
  <Mutation mutation={id ? DeleteReasonWeeklyHours : CreateReasonWeeklyHours}>{children}</Mutation>
);

ReasonWeeklyHoursToggle.propTypes = {
  id: PropTypes.string,
  children: PropTypes.func,
};
ReasonWeeklyHoursToggle.defaultProps = {
  id: null,
  children: null,
};

export default ReasonWeeklyHoursToggle;
