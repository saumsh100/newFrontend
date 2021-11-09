import React from 'react';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';

const query = gql`
  fragment dailyParts on ReasonDailyHours {
    id
    breaks {
      startTime
      endTime
    }
    availabilities {
      startTime
      endTime
    }
    isClosed
  }

  query fetchReasonWeeklyHours_NEST($reasonWeeklyHoursId: ID!) {
    reasonWeeklyHours(reasonWeeklyHoursReadInput: { id: $reasonWeeklyHoursId }) {
      id
      sunday: sundayHours {
        ...dailyParts
      }
      monday: mondayHours {
        ...dailyParts
      }
      tuesday: tuesdayHours {
        ...dailyParts
      }
      wednesday: wednesdayHours {
        ...dailyParts
      }
      thursday: thursdayHours {
        ...dailyParts
      }
      friday: fridayHours {
        ...dailyParts
      }
      saturday: saturdayHours {
        ...dailyParts
      }
    }
  }
`;

const FetchReasonHours = ({ children, reasonWeeklyHoursId }) => (
  <Query query={query} variables={{ reasonWeeklyHoursId }} skip={!reasonWeeklyHoursId}>
    {children}
  </Query>
);

FetchReasonHours.propTypes = {
  children: PropTypes.func,
  reasonWeeklyHoursId: PropTypes.string,
};

FetchReasonHours.defaultProps = {
  children: null,
  reasonWeeklyHoursId: null,
};

export default FetchReasonHours;
