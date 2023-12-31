import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';
import { DropdownMenu, List, MenuItem } from '../../../../library';
import { addFilter, setFilterActiveSegmentLabel } from '../../../../../reducers/patientTable';
import { fetchPatientTableData } from '../../../../../thunks/patientTable';
import HelpText from './HelpText';
import Tooltip from '../../../../Tooltip';
import Icon from '../../../../library/Icon';
import styles from '../../reskin-styles.scss';
import { initialSentRecalls } from '../../../Shared/helpers';

class SmartFilters extends Component {
  constructor(props) {
    super(props);
    this.setSmartFilter = this.setSmartFilter.bind(this);
    this.setDefaultSmartList = this.setDefaultSmartList.bind(this);
    this.state = {
      segmentLabel: null,
    };
  }

  componentDidMount() {
    this.setDefaultSmartList();
  }

  componentDidUpdate() {
    this.setDefaultSmartList();
    this.props.setFilterActiveSegmentLabel(this.state.segmentLabel);
  }

  setDefaultSmartList() {
    if (this.props.selectedSegment !== null) return;
    const defaultSegment = this.props.segments.toJS().find(({ isDefault }) => isDefault);
    this.setSmartFilter({
      segment: !defaultSegment ? 'allPatients' : defaultSegment.segment,
    });
  }

  getActiveSmartFilter([segment, ...args], segments = []) {
    const baseSegment = segments.filter((s) => s.segment === segment);
    const selectedSegment =
      args.length === 0
        ? baseSegment.find((s) => !s.value)
        : baseSegment.find((s) => s.value && s.value.every((v) => args.includes(v)));
    return selectedSegment && selectedSegment.label;
  }

  setSmartFilter({ segment, value = [] }, label = '') {
    const params = {};
    this.props.setFilterActiveSegmentLabel(label);
    this.setState({
      segmentLabel: label,
    });
    if (segment === 'followUps') {
      params.order = [
        ['patientFollowUps.dueAt', 'asc'],
        ['id', 'asc'],
      ];
    }

    if (segment === 'followUps' || segment === 'myFollowUps') {
      params.status = null;
    }

    if (segment === 'smartRecare') {
      params.order = [
        ['dueForHygieneDate', 'desc'],
        ['id', 'asc'],
      ];
    }

    if (label === '19-24 Months Late' || label === '25-36 Months Late') {
      params.sentRecalls = initialSentRecalls;
      this.props.change('recalls', 'sentRecalls', initialSentRecalls);
    }

    this.props.addFilter({
      segment: [segment, ...value],
      page: 0,
      ...params,
    });
    this.props.fetchPatientTableData();
  }

  render() {
    const { segments, selectedSegment, totalPatients } = this.props;
    if (!selectedSegment) return null;

    const segmentsToJS = (segments && segments.toJS()) || [];
    const activeSegmentLabel = this.getActiveSmartFilter(selectedSegment, segmentsToJS);
    const filterMenu = (p) => (
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
        <DropdownMenu
          labelComponent={filterMenu}
          data-test-id="dropDown_smartFilters"
          className={styles.dropdownMenu}
        >
          <div className={styles.filterContainer}>
            <List className={styles.smartFilter} data-test-id="smartFiltersList">
              {segmentsToJS.map(({ label, ...filter }, index) => {
                return (
                  <MenuItem
                    onClick={() => this.setSmartFilter(filter, label)}
                    data-test-id={`option_${index}`}
                    key={`smartFilter_${label}`}
                  >
                    {label}
                  </MenuItem>
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
  change: PropTypes.func.isRequired,
  setFilterActiveSegmentLabel: PropTypes.func.isRequired,
};

SmartFilters.defaultProps = {
  totalPatients: 0,
  segments: [],
};

const mapStateToProps = ({ patientTable, featureFlags }) => {
  const segments = featureFlags.getIn(['flags', 'custom-segments']);
  const selectedSegment = patientTable.getIn(['filters', 'segment']);
  return {
    segments,
    selectedSegment,
    totalPatients: patientTable.get('count'),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addFilter,
      fetchPatientTableData,
      change,
      setFilterActiveSegmentLabel,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SmartFilters);
