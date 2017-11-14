
import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import { destroy, arrayRemoveAll } from 'redux-form';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Grid, Row, Col } from '../../library';
import { fetchEntities, fetchEntitiesRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import PatientSubComponent from './PatientSubComponent';
import PatientNameColumn from './PatientNameColumn';
import SelectPatient from './SelectPatient';
import SideBarFilters from './SideBarFilters';
import HeaderSection from './HeaderSection';
import HygieneColumn from './HygieneColumn';
import styles from './styles.scss';

function getEntities(entities) {
  const data = [];
  _.each(entities, (collectionMap) => {
    _.each(collectionMap, (modelData) => {
      data.push(modelData);
    });
  });
  return data;
}

class PatientTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      limit: 15,
      totalPatients: 0,
      page: 0,
      sorted: [],
      expanded: {},
      search: '',
      filters: Map(),
      smartFilter: null,
      patientIds: [],
    };

    this.fetchData = debounce(this.fetchData, 300);
    this.pageChange = this.pageChange.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSort = this.onSort.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.reinitializeTable = this.reinitializeTable.bind(this);
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
    this.fetchData({
      limit: this.state.limit,
      page: 0,
    });
  }

  fetchData(query) {
    this.props.fetchEntitiesRequest({
      id: 'patientsTable',
      url: '/api/table',
      params: query,
    }).then((data) => {
      const dataArray = getEntities(data);

      if (dataArray.length) {
        this.setState({
          totalPatients: dataArray[0].totalPatients,
          data: dataArray[0].data,
        });
      } else {
        this.setState({
          totalPatients: 0,
          data: [],
        });
      }
    });
  }

  pageChange(index) {
    this.fetchData({
      limit: this.state.limit,
      sort: this.state.sorted,
      page: index,
      filters: this.state.filters.toArray(),
      smartFilter: this.state.smartFilter,
    });

    this.setState({
      page: index,
      expanded: {},
    });
  }

  pageSizeChange(pageSize, pageIndex) {
    this.fetchData({
      limit: pageSize,
      sort: this.state.sorted,
      page: pageIndex,
      filters: this.state.filters.toArray(),
      smartFilter: this.state.smartFilter,
    });

    this.setState({
      limit: pageSize,
      search: '',
    });
  }

  onSearch(value) {
    this.fetchData({
      search: value,
      page: 0,
      limit: this.state.limit,
      sort: this.state.sorted,
    });
    this.setState({
      search: value,
    });
  }

  onSort(newSorted) {
    this.fetchData({
      sort: newSorted,
      page: this.state.page,
      limit: this.state.limit,
      search: this.state.search,
      filters: this.state.filters.toArray(),
      smartFilter: this.state.smartFilter,
    });

    this.setState({
      sorted: newSorted,
    });
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

  addFilter(filter) {
    const {
      filters,
    } = this.state;

    const newFilters = filters.set(`${filter.indexFunc}`, filter);

    this.fetchData({
      filters: newFilters.toArray(),
      page: 0,
      limit: this.state.limit,
      sort: this.state.sorted,
      smartFilter: this.state.smartFilter,
    });

    this.setState({
      filters: newFilters,
      page: 0,
    });
  }

  setSmartFilter(filterObj) {
    if (filterObj.index > -1) {
      // this.clearFilters();
      this.fetchData({
        filters: this.state.filters.toArray(),
        page: 0,
        limit: this.state.limit,
        sort: this.state.sorted,
        smartFilter: filterObj,
      });

      this.setState({
        smartFilter: filterObj,
        page: 0,
        filters: this.state.filters,
      });
    } else {
      this.reinitializeTable();
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

    console.log(newIds);
    this.setState({
      patientIds: newIds,
    });
  }

  reinitializeTable() {
    this.clearFilters();

    this.setState({
      smartFilter: null,
      page: 0,
      filters: Map(),
      search: '',
      limit: 15,
      data: [],
      patientIds: [],
    });

    this.fetchData({
      limit: 15,
      page: 0,
    });
  }

  clearFilters() {
    const {
      destroy,
    } = this.props;

    const filtersArray = ['demographics', 'appointments', 'practitioners', 'communications'];
    filtersArray.forEach(filter => destroy(filter));
  }

  removeFilter(index) {
    const {
      filters,
    } = this.state;

    let removed = false;
    const size = filters.size;

    if (size) {
      removed = true;
      const newState = filters.delete(`${index}`);

      this.fetchData({
        filters: newState.toArray(),
        page: 0,
        limit: this.state.limit,
        sort: this.state.sorted,
        smartFilter: this.state.smartFilter,
      });

      this.setState({
        filters: newState,
      });
    }
    if (removed && size - 1 === 0) {
      this.setState({
        filters: Map(),
      });
    }
  }

  render() {
    const {
      wasFetched,
      push,
      createEntityRequest,
      practitioners,
      arrayRemoveAll,
    } = this.props;

    const {
      patientIds,
    } = this.state;

    const columns = [
      {
        Header: '',
        Cell: row => {
          return (
            <SelectPatient
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
        Cell: props => <div className={styles.displayFlex}><div className={styles.cellText}>{((this.state.page * this.state.limit) + props.index) + 1}</div></div>,
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
        maxWidth: 155,
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
        maxWidth: 155,
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
        Header: 'Due for Hygiene',
        Cell: (props) => {
          return (
            <HygieneColumn
              patient={props.original}
            />
          );
        },
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
        maxWidth: 120,
      },
    ];

    return (
      <Grid className={styles.mainContainer}>
        <Row>
          <Col xs={12} >
            <HeaderSection
              totalPatients={this.state.totalPatients}
              createEntityRequest={createEntityRequest}
              reinitializeTable={this.reinitializeTable}
              onSearch={this.onSearch}
              searchValue={this.state.search}
              smartFilter={this.state.smartFilter}
              setSmartFilter={this.setSmartFilter}
              patientIds={this.state.patientIds}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={10} className={styles.tableContainer}>
            <ReactTable
              data={this.state.data}
              page={this.state.page}
              pages={Math.floor(this.state.totalPatients / this.state.limit)}
              sorted={this.state.sorted}
              defaultPageSize={this.state.limit}
              pageSize={this.state.limit}
              loading={!wasFetched}
              expanded={this.state.expanded}
              pageSizeOptions={[15, 20, 25, 50, 100]}
              columns={columns}
              className="-highlight"
              manual
              filterable
              sortable={false}
              noDataText="No Patients Found"
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
              onExpandedChange={(newExpanded, index, event) => {
              }}
              getTdProps={(state, rowInfo, column, instance) => {
                let style = {};

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
              filters={this.state.filters}
              clearFilters={this.clearFilters}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}

PatientTable.propTypes = {

};

function mapStateToProps({ apiRequests, entities }) {
  const wasFetched = (apiRequests.get('patientsTable') ? apiRequests.get('patientsTable').wasFetched : null);
  const practitioners = entities.getIn(['practitioners', 'models']);


  return {
    wasFetched,
    practitioners,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
    createEntityRequest,
    push,
    destroy,
    arrayRemoveAll,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientTable);
