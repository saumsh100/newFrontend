
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button } from '../../../library';
import EllipsisIcon from './EllipsisIcon';
import { patientShape } from '../../../library/PropTypeShapes';
import tableStyles from './tableStyles.scss';

const WaitlistRow = ({
  addedDate,
  dates,
  duration,
  nextApptDate,
  note,
  patient,
  PopOverComponent,
  reasonText,
  times,
}) => (
  <tr>
    <td width={20} />

    <td className={tableStyles.col} data-width="sm">
      <Checkbox checked onChange={console.log} />
    </td>
    <td className={tableStyles.col}>{addedDate}</td>
    <td className={tableStyles.col}>
      <PopOverComponent patient={patient}>
        <div>{`${patient.firstName} ${patient.lastName}`}</div>
      </PopOverComponent>
    </td>
    <td className={tableStyles.col}>{reasonText}</td>
    <td className={tableStyles.col} data-width="sm">
      {duration}
    </td>
    <td className={tableStyles.col}>{dates}</td>
    <td className={tableStyles.col}>{times}</td>
    <td className={tableStyles.col}>{note}</td>
    <td className={tableStyles.col}>{nextApptDate}</td>
    <td className={tableStyles.col} data-width="sm">
      <Button className={tableStyles.ellipsisButton}>
        <EllipsisIcon />
      </Button>
    </td>

    <td width={20} />
  </tr>
);

export default React.memo(WaitlistRow);

WaitlistRow.propTypes = {
  PopOverComponent: PropTypes.element.isRequired,
  addedDate: PropTypes.string.isRequired,
  dates: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  nextApptDate: PropTypes.string,
  note: PropTypes.string,
  patient: PropTypes.shape(patientShape).isRequired,
  reasonText: PropTypes.string,
  times: PropTypes.string.isRequired,
};

WaitlistRow.defaultProps = {
  note: '',
  reasonText: '',
  nextApptDate: '',
};
