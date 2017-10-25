
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Icon } from '../../library';
import { fetchEntities, fetchEntitiesRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import PatientSubComponent from './PatientSubComponent';
import PatientNameColumn from './PatientNameColumn';
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
    };
    this.fetchData = debounce(this.fetchData, 500);
    this.pageChange = this.pageChange.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
    this.onFilterSearch = this.onFilterSearch.bind(this);
    this.onSort = this.onSort.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.onSmartFilter = this.onSmartFilter.bind(this);
    this.reinitializeTable = this.reinitializeTable.bind(this);
  }

  componentDidMount() {
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
      this.setState({
        totalPatients: dataArray[0].totalPatients,
        data: dataArray,
      });
    });
  }

  pageChange(index) {
    this.fetchData({
      limit: this.state.limit,
      sort: this.state.sorted,
      page: index,
    });
    this.setState({
      page: index,
    });
  }

  pageSizeChange(pageSize, pageIndex) {
    this.fetchData({
      limit: pageSize,
      sort: this.state.sorted,
      page: pageIndex,
    });
    this.setState({
      limit: pageSize,
    });
  }

  onFilterSearch(value) {
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
    });

    this.setState({
      sorted: newSorted,
    });
  }

  onSmartFilter(filterData) {
    this.fetchData({
      smartFilter: filterData,
      page: 0,
      limit: this.state.limit,
      sort: this.state.sorted,
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

  reinitializeTable() {
    this.fetchData({
      limit: this.state.limit,
      page: 0,
    });
  }

  render() {
    const {
      wasFetched,
      push,
      createEntityRequest,
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
        Header: 'Name',
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
      },
      {
        Header: 'Active',
        accessor: 'status',
        Cell: props => <div className={styles.displayFlex}><div className={styles.cellText_status}>{props.value}</div></div>,
        filterable: false,
        className: styles.colBg,
      },
      {
        Header: 'Next Appt',
        id: 'nextAppt',
        accessor: d => {
          if (d.hasOwnProperty('nextAppt')) {
            const dateValue = moment(d.nextAppt);
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
      },
      {
        Header: 'Last Appt',
        id: 'lastAppt',
        accessor: d => {
          if (d.hasOwnProperty('lastAppt')) {
            const dateValue = moment(d.lastAppt);
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
      },
    ];

    return (
      <div className={styles.mainContainer}>
        <HeaderSection
          totalPatients={this.state.totalPatients}
          createEntityRequest={createEntityRequest}
          addSmartFilter={this.onSmartFilter}
          reinitializeTable={this.reinitializeTable}
          onFilterSearch={this.onFilterSearch}
          searchValue={this.state.search}
        />
        <ReactTable
          data={this.state.data}
          page={this.state.page}
          pages={Math.floor(this.state.totalPatients / this.state.limit)}
          sorted={this.state.sorted}
          defaultPageSize={this.state.limit}
          loading={!wasFetched}
          expanded={this.state.expanded}
          pageSizeOptions={[15, 20, 25, 50, 100]}
          columns={columns}
          className="-striped -highlight"
          manual
          filterable
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
            this.onExpand(newExpanded, index, event);
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
            height: 'calc(100vh - 172px)',
          }}
        />
      </div>
    )
  }
}

PatientTable.propTypes = {

};

function mapStateToProps({ apiRequests, patientManagement }) {
  const wasFetched = (apiRequests.get('patientsTable') ? apiRequests.get('patientsTable').wasFetched : null);

  return {
    wasFetched,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
    createEntityRequest,
    push,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientTable);
