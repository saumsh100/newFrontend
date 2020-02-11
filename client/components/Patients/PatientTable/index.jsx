
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Grid, Row, Col, Card } from '../../library';
import {
  fetchEntities,
  fetchEntitiesRequest,
  createEntityRequest,
} from '../../../thunks/fetchEntities';
import { fetchPatientTableData } from '../../../thunks/patientTable';
import { setTableData, removeFilter, addFilter } from '../../../reducers/patientTable';
import PatientSubComponent from './PatientSubComponent';
import PatientNameColumn from './PatientNameColumn';
import SideBarFilters from './SideBarFilters';
import HeaderSection from './HeaderSection';
import HygieneColumn from '../Shared/HygieneColumn';
import FollowUpsColumn from '../Shared/FollowUpsColumn';
import ReasonColumn from '../Shared/ReasonColumn';
import {
  arrowStyle,
  backgroundWhite,
  tableStyle,
  headerStyle,
  bodyStyle,
  columnHeaderStyle,
} from './tableStyle';
import styles from './styles.scss';

const baseColumn = {
  className: styles.colBg,
  Header: '',
};

class PatientTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: {},
      patientIds: [],
    };

    this.pageChange = this.pageChange.bind(this);
    this.onSort = this.onSort.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.handlePatientSelection = this.handlePatientSelection.bind(this);
  }

  /**
   * Update sort and order options of the table,
   * if the provided param does not contain 'id' or 'desc' fields we early return with an error.
   *
   * @param newSorted
   */
  onSort([newSorted]) {
    if (!('id' in newSorted) || !('desc' in newSorted)) {
      console.error('Invalid sort options');
      return;
    }
    this.props.addFilter({ order: [[newSorted.id, newSorted.desc ? 'desc' : 'asc']] });
    this.props.fetchPatientTableData();
    this.setState({ expanded: {} });
  }

  /**
   * Set the actual page using the provided value.
   *
   * @param page
   */
  pageChange(page) {
    this.props.addFilter({ page });
    this.setState({
      expanded: {},
      patientIds: [],
    });
    this.props.fetchPatientTableData();
  }

  removeFilter(index) {
    this.props.removeFilter({ index });
    this.props.fetchPatientTableData();
  }

  /**
   * Expand or collapse a row, based on its current status.
   *
   * @param rowInfo
   */
  handleRowClick({ index }) {
    const handleExpandedValue = expanded => (expanded[index] ? {} : { [index]: true });
    this.setState(({ expanded }) => ({ expanded: handleExpandedValue(expanded) }));
  }

  /**
   * Handle the patient selection, if the patient is selected we unselect,
   * and if the patient is not selected yet we mark it as selected.
   *
   * @param id
   */
  handlePatientSelection(id) {
    /**
     * If it's a single value remove it from the array, otherwhise concat the value.
     * @param patientIds
     * @returns {*[]}
     */
    const handleSinglePatientSelection = patientIds =>
      (patientIds.includes(id) ? patientIds.filter(pId => pId !== id) : [...patientIds, id]);

    /**
     * If it's a multiple value check if values are already selected, so we can toggle the state.
     * @param length
     * @returns {Array}
     */
    const handleMultiplePatientsSelection = ({ length }) =>
      (length && length === id.length ? [] : id);

    this.setState(({ patientIds }) => ({
      patientIds:
        typeof id === 'string'
          ? handleSinglePatientSelection(patientIds)
          : handleMultiplePatientsSelection(patientIds),
    }));
  }

  /**
   * React table expects the sort value as an object with id and desc by default.
   *
   * @param order
   * @param sort
   * @returns {{id: string, desc: boolean}}
   */
  generateSortObject([order, sort]) {
    return {
      id: order,
      desc: sort === 'desc',
    };
  }

  render() {
    const patientTable = this.props.patientTable.toJS();
    const { patientIds } = this.state;
    const columns = [
      {
        ...baseColumn,
        expander: true,
        className: '',
        style: arrowStyle,
      },
      {
        ...baseColumn,
        sortable: false,
        maxWidth: 40,
        Header: '#',
        Cell: ({ original: { rowNumber } }) => (
          <div className={styles.displayFlex}>
            <div className={styles.cellText}>{rowNumber}</div>
          </div>
        ),
      },
      {
        ...baseColumn,
        sortable: false,
        maxWidth: 60,
        accessor: '',
        Cell: ({ value, original }) => (
          <div className={styles.displayFlex}>
            <PatientNameColumn
              isAvatar
              value={value}
              patient={original}
              redirect={() => {
                this.props.push(`/patients/${original.id}`);
              }}
              text=""
            />
          </div>
        ),
      },
      {
        ...baseColumn,
        Header: 'First Name',
        accessor: 'firstName',
        Cell: ({ value, original }) => (
          <div className={styles.displayFlex}>
            <PatientNameColumn
              value={value}
              patient={original}
              redirect={() => {
                this.props.push(`/patients/${original.id}`);
              }}
              text={original.firstName}
            />
          </div>
        ),
      },
      {
        ...baseColumn,
        Header: 'Last Name',
        accessor: 'lastName',
        Cell: ({ value, original }) => (
          <div className={styles.displayFlex}>
            <PatientNameColumn
              value={value}
              patient={original}
              redirect={() => {
                this.props.push(`/patients/${original.id}`);
              }}
              text={original.lastName}
            />
          </div>
        ),
      },
      {
        ...baseColumn,
        Header: 'HoH',
        accessor: 'isHoH',
        maxWidth: 50,
        Cell: ({ value }) => (
          <div className={styles.displayFlex}>
            {value ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 8 5"
                className={styles.crownIcon}
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M4.31 0c.236 0 .428.19.428.425a.421.421 0 01-.119.293l.92 1.218a.768.768 0 001.15.082l.566-.56A.423.423 0 017.523.7c.237 0 .43.191.43.426 0 .184-.12.342-.287.4 0 .02 0 .04-.006.06l-.45 1.781c-.013.056-.06.396-.117.647a.195.195 0 01.074.154v.486a.203.203 0 01-.204.202H1.679a.203.203 0 01-.204-.202v-.486c0-.071.037-.134.093-.17-.069-.246-.133-.564-.146-.618l-.45-1.787a.201.201 0 01-.005-.062.426.426 0 01-.3-.405C.667.892.859.7 1.095.7c.237 0 .43.191.43.426 0 .132-.062.25-.157.328l.562.561a.771.771 0 001.152-.077L4.006.725a.422.422 0 01-.126-.3C3.88.19 4.073 0 4.31 0z"
                />
              </svg>
            ) : (
              ''
            )}
          </div>
        ),
      },
      {
        ...baseColumn,
        Header: 'Last Hygiene Appt',
        id: 'lastHygieneDate',
        accessor: ({ lastHygieneDate }) =>
          (lastHygieneDate ? moment(lastHygieneDate).format('MMM DD YYYY') : '-'),
        Cell: ({ value }) => (
          <div className={styles.displayFlex}>
            <div className={styles.cellText_lastAppt}>{value}</div>
          </div>
        ),
      },
      {
        ...baseColumn,
        Header: 'Last Recall Exam',
        id: 'lastRecallDate',
        accessor: ({ lastRecallDate }) =>
          (lastRecallDate ? moment(lastRecallDate).format('MMM DD YYYY') : '-'),
        Cell: ({ value }) => (
          <div className={styles.displayFlex}>
            <div className={styles.cellText_lastAppt}>{value}</div>
          </div>
        ),
      },
      {
        ...baseColumn,
        Header: 'Next Appt',
        id: 'nextApptDate',
        accessor: ({ nextApptDate }) =>
          (nextApptDate ? moment(nextApptDate).format('MMM DD YYYY') : '-'),
        Cell: ({ value }) => (
          <div className={styles.displayFlex}>
            <div className={styles.cellText_lastAppt}>{value}</div>
          </div>
        ),
      },
      {
        ...baseColumn,
        Header: 'Due for Hygiene',
        id: 'dueForHygieneDate',
        Cell: ({ original }) => <HygieneColumn showTable patient={original} />,
      },
      {
        ...baseColumn,
        Header: 'Due for Follow Up',
        id: 'patientFollowUps.dueAt',
        Cell: ({ original }) => <FollowUpsColumn showTable patient={original} />,
      },
      {
        ...baseColumn,
        Header: 'Follow Up Reason',
        id: 'patientFollowUps->patientFollowUpTypes.name',
        Cell: ({ original }) => <ReasonColumn showTable patient={original} />,
      },
    ];

    return (
      <Grid className={styles.mainContainer}>
        <Row className={styles.rowHeader}>
          <Col xs={12}>
            <HeaderSection
              createEntityRequest={this.props.createEntityRequest}
              reinitializeTable={this.reinitializeTable}
              patientIds={patientIds}
              destroy={this.props.destroy}
            />
          </Col>
        </Row>
        <Row className={styles.rowTable}>
          <Col xs={12} className={styles.tableColWrapper}>
            <Card
              className={styles.tableContainer}
              runAnimation
              loaded={!patientTable.isLoadingTable}
            >
              <ReactTable
                manual
                data={patientTable.data}
                page={patientTable.filters.page}
                pages={Math.ceil(patientTable.count / patientTable.filters.limit)}
                sorted={[this.generateSortObject(patientTable.filters.order[0])]}
                defaultPageSize={patientTable.filters.limit}
                pageSize={patientTable.filters.limit}
                loading={patientTable.isLoadingTable}
                expanded={this.state.expanded}
                columns={columns}
                className="-highlight"
                showPageSizeOptions={false}
                noDataText="No Patients Found"
                loadingText=""
                SubComponent={row => <PatientSubComponent patient={row.original} />}
                onPageChange={this.pageChange}
                onSortedChange={this.onSort}
                getTdProps={(state, rowInfo) => {
                  const style = { cursor: 'pointer' };

                  if (rowInfo) {
                    style.background =
                      patientIds.indexOf(rowInfo.original.id) > -1 ? '#efefef' : 'inherit';
                  }

                  return {
                    onClick: (e, handleOriginal) => {
                      this.handleRowClick(rowInfo);
                      if (handleOriginal) {
                        handleOriginal();
                      }
                    },
                    style,
                  };
                }}
                getTableProps={() => backgroundWhite}
                getTheadTrProps={() => headerStyle}
                getTheadThProps={(state, rowInfo, { id }) => {
                  const [[order, sort]] = patientTable.filters.order;
                  const sortedClasses =
                    order === id && (sort === 'asc' ? styles.theadAsc : styles.theadDesc);

                  return {
                    style: columnHeaderStyle,
                    className: sortedClasses,
                  };
                }}
                getTfootThProps={() => backgroundWhite}
                getTbodyProps={() => bodyStyle}
                style={tableStyle}
              />
            </Card>
            <div className={styles.filterContainer}>
              <SideBarFilters
                setFilterCallback={this.props.fetchPatientTableData}
                removeFilter={this.removeFilter}
              />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

PatientTable.propTypes = {
  addFilter: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  destroy: PropTypes.func.isRequired,
  fetchPatientTableData: PropTypes.func.isRequired,
  patientTable: PropTypes.objectOf(PropTypes.any).isRequired,
  push: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
};

const mapStateToProps = ({ entities, patientTable }) => ({
  practitioners: entities.getIn(['practitioners', 'models']),
  patientTable,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchEntities,
      createEntityRequest,
      fetchPatientTableData,
      fetchEntitiesRequest,
      push,
      destroy,
      setTableData,
      addFilter,
      removeFilter,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientTable);
