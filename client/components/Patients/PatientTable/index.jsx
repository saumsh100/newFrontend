
import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Grid, Row, Col} from '../../library';
import { fetchEntities, fetchEntitiesRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import PatientSubComponent from './PatientSubComponent';
import PatientNameColumn from './PatientNameColumn';
import SideBarFilters from './SideBarFilters';
import HeaderSection from './HeaderSection';
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
          data: dataArray,
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

    if (!expanded.hasOwnProperty(rowInfo.index)) {
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

    const newFilters = filters.set(`${filter.type}`, filter);

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
      this.fetchData({
        filters: [],
        page: 0,
        limit: this.state.limit,
        sort: this.state.sorted,
        smartFilter: filterObj,
      });

      this.setState({
        smartFilter: filterObj,
        page: 0,
        filters: Map(),
      });
      this.clearFilters();
    } else {
      this.reinitializeTable();
      this.clearFilters();
    }
  }

  reinitializeTable() {
    this.setState({
      smartFilter: null,
      page: 0,
      filters: Map(),
      search: '',
      limit: 15,
      data: [],
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
    filtersArray.map(filter => destroy(filter));
  }

  render() {
    const {
      wasFetched,
      push,
      createEntityRequest,
      practitioners,
    } = this.props;

    const columns = [
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
        Header: 'Next Appt',
        id: 'nextAppt',
        accessor: d => {
          if (d.hasOwnProperty('nextAppt.startDate')) {
            const dateValue = moment(d['nextAppt.startDate']);
            return dateValue.isValid() ? dateValue.format('MMMM Do YYYY') : '';
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
        maxWidth: 180,

      },
      {
        Header: 'Last Appt',
        id: 'lastAppt',
        accessor: d => {
          if (d.hasOwnProperty('lastAppt.startDate')) {
            const dateValue = moment(d['lastAppt.startDate']);
            return dateValue.isValid() ? dateValue.format('MMMM Do YYYY') : '';
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
        maxWidth: 180,
      },
      {
        Header: 'Production Revenue',
        id: 'totalAmount',
        accessor: d => {
          return d.hasOwnProperty('totalAmount') ? `$${d.totalAmount.toFixed(2)}` : '';
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
              className="-striped -highlight"
              manual
              filterable
              showPagination={true}
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
                return {
                  onClick: (e, handleOriginal) => {
                    this.handleRowClick(rowInfo, column);

                    if (handleOriginal) {
                      handleOriginal();
                    }
                  },
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
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientTable);
