
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
import { Grid, Row, Col } from '../../library';
import { fetchEntities, createEntityRequest } from '../../../thunks/fetchEntities'
import { fetchPatientTableData } from '../../../thunks/patientTable';
import { setTableData, setSmartFilter, setFilters, removeFilter, clearFilters } from '../../../reducers/patientTable';
import PatientSubComponent from './PatientSubComponent';
import PatientNameColumn from './PatientNameColumn';
import SelectPatientColumn from './SelectPatientColumn';
import SideBarFilters from './SideBarFilters';
import HeaderSection from './HeaderSection';
import HygieneColumn from './HygieneColumn';
import styles from './styles.scss';
import Loading from "../../library/Loading/index";


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
  }

  componentDidMount() {
    this.props.fetchEntities({
      key: 'practitioners',
    });

    this.fetchData();
  }



  pageChange(index) {
    this.props.setTableData({ page: index });
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
  }

  setSmartFilter(filterObj) {
    this.props.setSmartFilter({ smFilter: filterObj });
    this.fetchData();
  }

  fetchData() {
    this.props.fetchPatientTableData();
  }

  clearFilters() {
    const {
      destroy,
    } = this.props;

    const filtersArray = ['demographics', 'appointments', 'practitioners', 'communications'];
    filtersArray.forEach(filter => destroy(filter));

    this.props.clearFilters();
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

  render() {
    const {
      push,
      createEntityRequest,
      practitioners,
      arrayRemoveAll,
      patientTable,
      filters,
    } = this.props;

    const {
      patientIds,
    } = this.state;

    const columns = [
      {
        Header: '',
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
        Cell: props => <div className={styles.displayFlex}><div className={styles.cellText}>{((patientTable.page * patientTable.limit) + props.index) + 1}</div></div>,
        filterable: false,
        sortable: false,
        maxWidth: 50,
        className: styles.colBg,
      },
      {
        Header: '',
        accessor: '',
        Cell: row => {
          return (
            <div className={styles.displayFlex}>
              <PatientNameColumn
                value={row.value}
                patient={row.original}
                redirect={() => {
                  push(`/patients/${row.original.id}`);
                }}
                text=''
              />
            </div>
          );
        },
        maxWidth: 45,
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
        Cell: row => {
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
        Cell: row => {
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
        accessor: d => {
          const dateValue = moment().diff(d.birthDate, 'years');
          return Number.isInteger(dateValue) ? dateValue : '';
        },
        Cell: props => <div className={styles.displayFlex}><div className={styles.cellText}>{props.value}</div></div>,
        filterable: false,
        className: styles.colBg,
        maxWidth: 50,
      },
      {
        Header: 'Active',
        accessor: 'status',
        Cell: props => <div className={styles.displayFlex}><div className={styles.cellText}>{props.value}</div></div>,
        filterable: false,
        className: styles.colBg,
        maxWidth: 80,
      },
      {
        Header: 'Next Appointment',
        id: 'nextApptDate',
        accessor: d => {
          if (d.hasOwnProperty('nextApptDate')) {
            const dateValue = moment(d['nextApptDate']);
            return dateValue.isValid() ? dateValue.format('MMM DD YYYY') : '';
          }
          return '';
        },
        Cell: (props) => {
          return (<div className={styles.displayFlex}>
            <div className={styles.cellText_lastAppt}>{props.value}</div>
          </div>);
        },
        filterable: false,
        className: styles.colBg,

      },
      {
        Header: 'Last Appointment',
        id: 'lastApptDate',
        accessor: d => {
          if (d.hasOwnProperty('lastApptDate')) {
            const dateValue = moment(d['lastApptDate']);
            return dateValue.isValid() ? dateValue.format('MMM DD YYYY') : '';
          }
          return '';
        },
        Cell: (props) => {
          return (<div className={styles.displayFlex}>
            <div className={styles.cellText_lastAppt}>{props.value}</div>
          </div>);
        },
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Due for Hygiene (9mo)',
        Cell: (props) => {
          return (
            <HygieneColumn
              patient={props.original}
            />
          );
        },
        sortable: false,
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Production in Calendar Year',
        id: 'totalAmount',
        accessor: d => {
          return d.hasOwnProperty('totalAmount') && d.totalAmount ? `$${d.totalAmount.toFixed(2)}` : '';
        },
        Cell: props => <div className={styles.displayFlex}><div className={styles.cellText_revenue}>{props.value}</div></div>,
        filterable: false,
        sortable: false,
        className: styles.colBg,
      },
    ];

    return (
      <Grid className={styles.mainContainer}>
        <Row>
          <Col xs={12} >
            <HeaderSection
              totalPatients={patientTable.totalPatients}
              createEntityRequest={createEntityRequest}
              reinitializeTable={this.reinitializeTable}
              smartFilter={patientTable.smartFilter}
              setSmartFilter={this.setSmartFilter}
              patientIds={this.state.patientIds}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={10} className={styles.tableContainer}>
            <ReactTable
              data={patientTable.data}
              page={patientTable.page}
              pages={Math.floor(patientTable.totalPatients / patientTable.limit)}
              sorted={patientTable.sort}
              defaultPageSize={patientTable.limit}
              pageSize={patientTable.limit}
              loading={patientTable.isLoadingTable}
              expanded={this.state.expanded}
              pageSizeOptions={[15, 20, 25, 50, 100]}
              columns={columns}
              className="-highlight"
              manual
              filterable
              showPageSizeOptions={false}
              noDataText="No Patients Found"
              loadingText={<Loading />}
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
              onSortedChange={(newSorted, column, shiftKey) => {
                this.onSort(newSorted);
              }}
              onPageSizeChange={(pageSize, pageIndex) => {
                this.pageSizeChange(pageSize, pageIndex);
              }}
              getTdProps={(state, rowInfo, column, instance) => {
                const style = {};

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
                return {
                  style: {
                    background: 'white',
                  },
                };
              }}
              getTheadTrProps={() => {
                return {
                  style: {
                    background: 'white',
                    color: '#959596',
                    paddingTop: '3px',
                    fontSize: '12px',
                    opacity: '0.6',
                  },
                };
              }}
              getTheadThProps={() => {
                return {
                  style: {
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  },
                };
              }}
              getTfootThProps={() => {
                return {
                  style: {
                    background: 'white',
                  },
                };
              }}
              getTbodyProps={() => {
                return {
                  style: {
                    background: 'white',
                  },
                };
              }}

              style={{
                height: 'calc(100vh - 188px)',
                background: 'white',
              }}
            />
          </Col>
          <Col xs={2}>
            <SideBarFilters
              addFilter={this.addFilter}
              practitioners={practitioners}
              arrayRemoveAll={arrayRemoveAll}
              removeFilter={this.removeFilter}
              filters={filters}
              clearFilters={this.clearFilters}
            />
          </Col>
        </Row>
      </Grid>
    )
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
};

function mapStateToProps({ apiRequests, entities, patientTable }) {
  const wasFetched = (apiRequests.get('patientsTable') ? apiRequests.get('patientsTable').wasFetched : null);
  const practitioners = entities.getIn(['practitioners', 'models']);

  const filters = patientTable.get('filters');
  return {
    wasFetched,
    practitioners,
    filters,
    patientTable: patientTable.toJS(),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    fetchPatientTableData,
    push,
    destroy,
    arrayRemoveAll,
    setTableData,
    setSmartFilter,
    setFilters,
    removeFilter,
    clearFilters,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientTable);
