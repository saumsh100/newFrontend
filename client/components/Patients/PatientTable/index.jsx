
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { destroy, arrayRemoveAll } from 'redux-form';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Grid, Row, Col, Card } from '../../library';
import { fetchEntities, fetchEntitiesRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import { fetchPatientTableData } from '../../../thunks/patientTable';
import {
  setTableData,
  setSmartFilter,
  setFilters,
  removeFilter,
  clearFilters,
  clearSearch,
} from '../../../reducers/patientTable';
import PatientSubComponent from './PatientSubComponent';
import PatientNameColumn from './PatientNameColumn';
import SelectPatientColumn from './SelectPatientColumn';
import SideBarFilters from './SideBarFilters';
import HeaderSection from './HeaderSection';
import HygieneColumn from '../Shared/HygieneColumn';
import HygieneRecallColumn from '../Shared/HygieneRecallColumn';
import RecallColumn from '../Shared/RecallColumn';
import SelectAllPatients from './SelectPatientColumn/SelectAllPatients';
import styles from './styles.scss';

class PatientTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: {},
      patientIds: [],
    };

    this.fetchData = debounce(this.fetchData, 300);
    this.pageChange = this.pageChange.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
    this.onSort = this.onSort.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.setSmartFilter = this.setSmartFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.handlePatientSelection = this.handlePatientSelection.bind(this);
    this.selectAllPatients = this.selectAllPatients.bind(this);
    this.searchPatients = debounce(this.searchPatients.bind(this), 300);
  }

  componentDidMount() {
    Promise.all([
      this.props.fetchEntities({
        key: 'practitioners',
      }),
      this.props.fetchEntitiesRequest({
        id: 'accountsTable',
        key: 'accounts',
      }),
      this.fetchData(),
    ]);
  }

  pageChange(index) {
    this.props.setTableData({ page: index });
    this.setState({
      expanded: {},
      patientIds: [],
    });
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.props.setTableData({ limit: pageSize });
    this.fetchData();
  }

  onSort(newSorted) {
    this.props.setTableData({ sort: newSorted });
    this.fetchData();

    this.setState({
      expanded: {},
    });
  }

  addFilter(filter) {
    this.props.setFilters({ filter });
    this.fetchData();

    this.setState({
      expanded: {},
    });
  }

  setSmartFilter(filterObj) {
    this.props.setSmartFilter({ smFilter: filterObj });
    this.fetchData();
  }

  fetchData() {
    this.props.fetchPatientTableData();
  }

  clearFilters() {
    const filtersArray = [
      'demographics',
      'appointments',
      'practitioners',
      'communications',
      'SearchPatientTable',
    ];

    filtersArray.forEach(filter => this.props.destroy(filter));

    this.props.clearFilters();
    this.props.clearSearch();
    this.fetchData();
  }

  removeFilter(index) {
    this.props.removeFilter({ index });
    this.fetchData();
  }

  handleRowClick(rowInfo) {
    const {
      expanded,
    } = this.state;

    if (rowInfo && !expanded.hasOwnProperty(rowInfo.index)) {
      const indexObj = {};
      indexObj[rowInfo.index] = true;
      this.setState({
        expanded: indexObj,
      });
    } else {
      this.setState({
        expanded: {},
      });
    }
  }

  handlePatientSelection(id) {
    const {
      patientIds,
    } = this.state;

    let newIds = patientIds;

    if (newIds.indexOf(id) > -1) {
      newIds = newIds.filter(pId => pId !== id);
    } else {
      newIds.push(id);
    }

    this.setState({
      patientIds: newIds,
    });
  }

  selectAllPatients() {
    const {
      patientTable,
    } = this.props;

    const length = this.state.patientIds.length

    if (length !== patientTable.data.length) {
      const patients = patientTable.data;
      const patientIds = [];

      patients.forEach((patient) => {
        patientIds.push(patient.id)
      });

      this.setState({
        patientIds,
      });
    } else if (length === patientTable.data.length) {
      this.setState({
        patientIds: [],
      });
    }

    return null;
  }

  searchPatients(values) {
    this.props.setTableData({
      searchFirstName: values && values.searchFirstName ? values.searchFirstName : '',
      searchLastName: values && values.searchLastName ? values.searchLastName : '',
      page: 0,
    });

    this.setState({
      expanded: {},
    });
    this.fetchData();
  }

  render() {
    const {
      push,
      createEntityRequest,
      practitioners,
      arrayRemoveAll,
      patientTable,
      filters,
      accountsFetched,
      activeAccount,
    } = this.props;

    const {
      patientIds,
    } = this.state;

    const columns = [
      {
        Header: '',
        expander: true,
        style: {
          cursor: 'pointer',
          fontSize: 18,
          padding: '0',
          textAlign: 'center',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      {
        Header: (row) => {
          return (
            <SelectAllPatients
              selectAllPatients={this.selectAllPatients}
              patientIds={patientIds}
              maxPatients={row.data.length}
            />
          );
        },
        Cell: row => {
          return (
            <SelectPatientColumn
              patientIds={patientIds}
              handlePatientSelection={this.handlePatientSelection}
              id={row.original.id}
            />
          );
        },
        filterable: false,
        sortable: false,
        maxWidth: 50,
        className: styles.colBg,
      },
      {
        Header: '#',
        Cell: (props) => {
          return (
            <div className={styles.displayFlex}>
              <div className={styles.cellText}>
                {((patientTable.page * patientTable.limit) + props.index) + 1}
              </div>
            </div>
          );
        },

        filterable: false,
        sortable: false,
        maxWidth: 40,
        className: styles.colBg,
      },
      {
        Header: '',
        accessor: '',
        Cell: (row) => {
          return (
            <div className={styles.displayFlex}>
              <PatientNameColumn
                value={row.value}
                patient={row.original}
                redirect={() => {
                  push(`/patients/${row.original.id}`);
                }}
                text={''}
              />
            </div>
          );
        },
        sortable: false,
        filterable: false,
        className: styles.colBg,
        maxWidth: 60,
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
        Cell: (row) => {
          return (
            <div className={styles.displayFlex}>
              <PatientNameColumn
                value={row.value}
                patient={row.original}
                redirect={() => {
                  push(`/patients/${row.original.id}`);
                }}
                text={row.original.firstName}
                noAvatar
              />
            </div>
          );
        },
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
        Cell: (row) => {
          return (
            <div className={styles.displayFlex}>
              <PatientNameColumn
                value={row.value}
                patient={row.original}
                redirect={() => {
                  push(`/patients/${row.original.id}`);
                }}
                text={row.original.lastName}
                noAvatar
              />
            </div>
          );
        },
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Age',
        id: 'birthDate',
        accessor: (d) => {
          const dateValue = moment().diff(d.birthDate, 'years');
          return Number.isInteger(dateValue) ? dateValue : '';
        },
        Cell: props => <div className={styles.displayFlex}><div className={styles.cellText}>{props.value}</div></div>,
        filterable: false,
        className: styles.colBg,
        show: false,
      },
      {
        Header: 'Active',
        accessor: 'status',
        Cell: props => (
          <div className={styles.displayFlex}>
            <div className={styles.cellText}>
              {props.value}
            </div>
          </div>
        ),
        show: false,
        filterable: false,
        className: styles.colBg,
        maxWidth: 100,
      },
      {
        Header: 'Last Appt',
        id: 'lastApptDate',
        accessor: (d) => {
          if (d.hasOwnProperty('lastApptDate')) {
            const dateValue = moment(d['lastApptDate']);
            return dateValue.isValid() ? dateValue.format('MMM DD YYYY') : '-';
          }
          return '-';
        },

        Cell: (props) => {
          return (
            <div className={styles.displayFlex}>
              <div className={styles.cellText_lastAppt}>{props.value}</div>
            </div>
          );
        },

        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Last Hygiene Appt',
        id: 'lastHygieneDate',
        accessor: (d) => {
          if (d.hasOwnProperty('lastHygieneDate')) {
            const dateValue = moment(d['lastHygieneDate']);
            return dateValue.isValid() ? dateValue.format('MMM DD YYYY') : '-';
          }

          return '-';
        },

        Cell: (props) => {
          return (
            <div className={styles.displayFlex}>
              <div className={styles.cellText_lastAppt}>{props.value}</div>
            </div>
          );
        },
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Last Recall Exam',
        id: 'lastRecallDate',
        accessor: (d) => {
          if (d.hasOwnProperty('lastRecallDate')) {
            const dateValue = moment(d['lastRecallDate']);
            return dateValue.isValid() ? dateValue.format('MMM DD YYYY') : '-';
          }

          return '-';
        },

        Cell: (props) => {
          return (
            <div className={styles.displayFlex}>
              <div className={styles.cellText_lastAppt}>{props.value}</div>
            </div>
          );
        },

        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Next Appt',
        id: 'nextApptDate',
        accessor: (d) => {
          if (d.hasOwnProperty('nextApptDate')) {
            const dateValue = moment(d['nextApptDate']);
            return dateValue.isValid() ? dateValue.format('MMM DD YYYY') : '-';
          }
          return '-';
        },

        Cell: (props) => {
          return (
            <div className={styles.displayFlex}>
              <div className={styles.cellText_lastAppt}>
                {props.value}
              </div>
            </div>
          );
        },

        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Due for Hygiene',
        id: 'dueForHygieneDate',
        Cell: (props) => {
          return (
            <HygieneColumn
              showTable
              patient={props.original}
              activeAccount={activeAccount}
            />
          );
        },
        sortable: true,
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Due for Recall',
        id: 'dueForRecallExamDate',
        Cell: (props) => {
          return (
            <RecallColumn
              showTable
              patient={props.original}
              activeAccount={activeAccount}
            />
          );
        },
        sortable: true,
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Production in Calendar Year',
        id: 'totalAmount',
        accessor: (d) => {
          return d.hasOwnProperty('totalAmount') && d.totalAmount ? `$${d.totalAmount.toFixed(2)}` : '';
        },

        Cell: props => (
          <div className={styles.displayFlex}>
            <div className={styles.cellText_revenue}>
              {props.value}
            </div>
          </div>
        ),
        show: false,
        filterable: false,
        sortable: false,
        className: styles.colBg,
      },
    ];

    const backgroundWhite = {
      style: {
        background: 'white',
      },
    };

    const tableStyle = {
      background: 'white',
      border: '0px',
      height: '100%',
    };

    const headerStyle = {
      style: {
        background: 'white',
        paddingTop: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #efefef',
        fontSize: '12px',
      },
    };

    const bodyStyle = {
      style: {
        height: '100%',
        background: 'white',
      },
    };

    const columnHeaderStyle = {
      background: 'white',
      display: 'flex',
      justifyContent: 'flex-start',
      boxShadow: 'none',
      alignItems: 'center',
      borderRight: 'none',
      color: '#a7a9ac',
      outline: 'none',
    };

    return (
      <Grid className={styles.mainContainer}>
        <Row className={styles.rowHeader}>
          <Col xs={12}>
            <HeaderSection
              totalPatients={patientTable.totalPatients}
              createEntityRequest={createEntityRequest}
              reinitializeTable={this.reinitializeTable}
              smartFilter={patientTable.smartFilter}
              setSmartFilter={this.setSmartFilter}
              patientIds={this.state.patientIds}
              destroy={this.props.destroy}
            />
          </Col>
        </Row>
        <Row className={styles.rowTable}>
          <Col xs={12} className={styles.tableColWrapper}>
            <Card className={styles.tableContainer} runAnimation loaded={!patientTable.isLoadingTable}>
              <ReactTable
                data={patientTable.data}
                page={patientTable.page}
                pages={Math.ceil(patientTable.totalPatients / patientTable.limit)}
                sorted={patientTable.sort}
                defaultPageSize={patientTable.limit}
                pageSize={patientTable.limit}
                loading={patientTable.isLoadingTable && accountsFetched}
                expanded={this.state.expanded}
                pageSizeOptions={[15, 20, 25, 50, 100]}
                columns={columns}
                className="-highlight"
                manual
                // filterable
                showPageSizeOptions={false}
                noDataText="No Patients Found"
                loadingText=""
                SubComponent={(row) => {
                  return (
                    <PatientSubComponent
                      patient={row.original}
                    />
                  );
                }}
                onPageChange={(pageIndex) => {
                  this.pageChange(pageIndex);
                }}
                onSortedChange={(newSorted) => {
                  this.onSort(newSorted);
                }}
                onPageSizeChange={(pageSize, pageIndex) => {
                  this.pageSizeChange(pageSize, pageIndex);
                }}
                getTdProps={(state, rowInfo, column) => {
                  const style = {
                    cursor: 'pointer',
                  };

                  if (rowInfo) {
                    style.background = patientIds.indexOf(rowInfo.original.id) > -1 ? '#efefef' : 'inherit';
                  }

                  return {
                    onClick: (e, handleOriginal) => {
                      this.handleRowClick(rowInfo, column);
                      if (handleOriginal) {
                        handleOriginal();
                      }
                    },
                    style,
                  };
                }}
                getTableProps={() => {
                  return backgroundWhite;
                }}
                getTheadTrProps={() => {
                  return headerStyle;
                }}

                getTheadThProps={(state, rowInfo, column) => {
                  const compare = patientTable.sort && patientTable.sort.length ? patientTable.sort[0].id : null;
                  let sortedClasses = styles.theadAsc;
                  if (column.id === compare && patientTable.sort[0].desc) {
                    sortedClasses = styles.theadDesc;
                  }

                  return {
                    style: columnHeaderStyle,
                    className: column.id === compare ? sortedClasses : null,
                  };
                }}
                getTfootThProps={() => {
                  return backgroundWhite;
                }}
                getTbodyProps={() => {
                  return bodyStyle;
                }}

                style={tableStyle}
              />
            </Card>
            <div className={styles.filterContainer}>
              <SideBarFilters
                addFilter={this.addFilter}
                practitioners={practitioners}
                arrayRemoveAll={arrayRemoveAll}
                removeFilter={this.removeFilter}
                filters={filters}
                clearFilters={this.clearFilters}
                searchPatients={this.searchPatients}
              />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

PatientTable.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  fetchPatientTableData: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  destroy: PropTypes.func.isRequired,
  arrayRemoveAll: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
  setSmartFilter: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  practitioners: PropTypes.object,
  patientTable: PropTypes.object,
  filters: PropTypes.object,
  clearSearch: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, patientTable, apiRequests, auth }) {
  const practitioners = entities.getIn(['practitioners', 'models']);

  const filters = patientTable.get('filters');

  const waitForAuth = auth.get('accountId');
  const activeAccount = entities.getIn(['accounts', 'models', waitForAuth]);

  const accountsFetched = (apiRequests.get('accountsTable') ? apiRequests.get('accountsTable').wasFetched : null);

  return {
    practitioners,
    filters,
    activeAccount,
    accountsFetched,
    patientTable: patientTable.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    fetchPatientTableData,
    fetchEntitiesRequest,
    push,
    destroy,
    arrayRemoveAll,
    setTableData,
    setSmartFilter,
    setFilters,
    removeFilter,
    clearFilters,
    clearSearch,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientTable);
