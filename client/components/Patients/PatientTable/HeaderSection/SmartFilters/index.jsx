
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DropdownMenu, List, ListItem } from '../../../../library';
import { addFilter } from '../../../../../reducers/patientTable';
import { fetchPatientTableData } from '../../../../../thunks/patientTable';
import smartFilters, { getActiveSmartFilter } from './smartFilters';
import Icon from '../../../../library/Icon';
import styles from '../../styles.scss';

const SmartFilters = ({ activeSegmentLabel, totalPatients, ...props }) => {
  const setSmartFilter = ({ segment, value = [] }) => {
    props.addFilter({
      segment: [segment, ...value],
      page: 0,
    });
    props.fetchPatientTableData();
  };

  const filterMenu = p => (
    <div {...p} className={styles.filterMenuButton}>
      <div className={styles.header_title}>
        {activeSegmentLabel}
        <div className={styles.header_icon}>
          <Icon icon="caret-down" type="solid" size={1.7} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <DropdownMenu labelComponent={filterMenu} data-test-id="dropDown_smartFilters">
        <div className={styles.filterContainer}>
          <List className={styles.smartFilter} data-test-id="smartFiltersList">
            {smartFilters.map(({ label, ...filter }, index) => {
              const borderStyle =
                (label === activeSegmentLabel && { borderLeft: '3px solid #FF715A' }) || {};
              return (
                <ListItem
                  className={styles.filterItem}
                  onClick={() => setSmartFilter(filter)}
                  style={borderStyle}
                  data-test-id={`option_${index}`}
                  key={`smartFilter_${label}`}
                >
                  {label}
                </ListItem>
              );
            })}
          </List>
        </div>
      </DropdownMenu>
      <div className={styles.header_subHeader} data-test-id="text_totalPatientsCount">
        {`Showing ${totalPatients} Patient${totalPatients > 1 ? 's' : ''}`}
      </div>
    </div>
  );
};

SmartFilters.propTypes = {
  activeSegmentLabel: PropTypes.string.isRequired,
  addFilter: PropTypes.func.isRequired,
  fetchPatientTableData: PropTypes.func.isRequired,
  totalPatients: PropTypes.number,
};

SmartFilters.defaultProps = { totalPatients: 0 };

const mapStateToProps = ({ patientTable }) => {
  const segment = patientTable.getIn(['filters', 'segment']);
  return {
    activeSegmentLabel: getActiveSmartFilter(segment).label,
    totalPatients: patientTable.get('count'),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addFilter,
      fetchPatientTableData,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SmartFilters);
