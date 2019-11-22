
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DropdownMenu, List, ListItem } from '../../../../library';
import { addFilter } from '../../../../../reducers/patientTable';
import { fetchPatientTableData } from '../../../../../thunks/patientTable';
import HelpText from './HelpText';
import Tooltip from '../../../../Tooltip';
import Icon from '../../../../library/Icon';
import styles from '../../styles.scss';

class SmartFilters extends Component {
  constructor(props) {
    super(props);
    this.setSmartFilter = this.setSmartFilter.bind(this);
  }

  componentDidMount() {
    const isDCC =
      this.props.segments.toJS().findIndex(({ segment }) => segment === 'dccRecalls') !== -1;
    // DCC practices has a customized initial state
    if (isDCC) {
      this.setSmartFilter({ segment: 'dccRecalls' });
    }
  }

  getActiveSmartFilter([segment, ...args], segments = []) {
    const baseSegment = segments.filter(s => s.segment === segment);
    const selectedSegment =
      args.length === 0
        ? baseSegment.find(s => !s.value)
        : baseSegment.find(s => s.value && s.value.every(v => args.includes(v)));
    return selectedSegment && selectedSegment.label;
  }

  setSmartFilter({ segment, value = [] }) {
    this.props.addFilter({
      segment: [segment, ...value],
      page: 0,
    });
    this.props.fetchPatientTableData();
  }

  render() {
    const { segments, selectedSegment, totalPatients } = this.props;
    const segmentsToJS = (segments && segments.toJS()) || [];
    const activeSegmentLabel = this.getActiveSmartFilter(selectedSegment, segmentsToJS);
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
              {segmentsToJS.map(({ label, ...filter }, index) => {
                const borderStyle =
                  (label === activeSegmentLabel && { borderLeft: '3px solid #FF715A' }) || {};
                return (
                  <ListItem
                    className={styles.filterItem}
                    onClick={() => this.setSmartFilter(filter)}
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
        <div className={styles.header_subHeader}>
          <div data-test-id="text_totalPatientsCount">
            {`Showing ${totalPatients} Patient${totalPatients > 1 ? 's' : ''}`}
          </div>
          <Tooltip body={<HelpText activeSegmentLabel={activeSegmentLabel} />}>
            <Icon icon="question-circle" size={0.9} />
          </Tooltip>
        </div>
      </div>
    );
  }
}

SmartFilters.propTypes = {
  activeSegmentLabel: PropTypes.string.isRequired,
  addFilter: PropTypes.func.isRequired,
  fetchPatientTableData: PropTypes.func.isRequired,
  segments: PropTypes.arrayOf(PropTypes.object),
  totalPatients: PropTypes.number,
  selectedSegment: PropTypes.string.isRequired,
};

SmartFilters.defaultProps = {
  totalPatients: 0,
  segments: [],
};

const mapStateToProps = ({ patientTable, featureFlags }) => {
  const segments = featureFlags.getIn(['flags', 'custom-segments']);
  // check if there's dccRecalls flag
  const selectedSegment = patientTable.getIn(['filters', 'segment']);
  return {
    segments,
    selectedSegment,
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
