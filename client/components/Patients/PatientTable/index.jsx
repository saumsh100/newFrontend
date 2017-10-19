
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { fetchEntities, fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import PatientSubComponent from './PatientSubComponent';
import PatientRow from './PatientRow';
import styles from './styles.scss';
import { Button } from '../../library';

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
      limit: 20,
      loading: true,
      totalPatients: 0,
      currentPage: 0,
      sorted: [],
      expanded: {},
    };
    this.fetchData = debounce(this.fetchData, 200);
    this.pageChange = this.pageChange.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSort = this.onSort.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentDidMount() {
    const query = {
      count: true,
    };

    this.props.fetchEntitiesRequest({
      id: 'patientTotalCount',
      url: '/api/patients/table',
      params: query,
    }).then((totalPatients) => {
      this.setState({
        totalPatients,
      });
      this.fetchData({
        limit: this.state.limit,
        page: 0,
      });
    });
  }

  fetchData(query) {
    this.props.fetchEntities({
      key: 'patients',
      url: '/api/patients/table',
      params: query,
    }).then((data) => {
      const dataArray = getEntities(data);
      this.setState({
        data: dataArray,
        loading: false,
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
      currentPage: index,
      loading: true,
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
      loading: true,
    });
  }

  onFilter(column) {
    this.fetchData({
      filter: column,
      page: 0,
      limit: this.state.limit,
      sort: this.state.sorted,
    });
    this.setState({
      loading: true,
    });
  }

  onSort(newSorted) {
    this.fetchData({
      sort: newSorted,
      page: 0,
      limit: this.state.limit,
    });
    this.setState({
      sorted: newSorted,
      loading: true,
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

  render() {
    const {
      wasFetched,
      push,
    } = this.props;

    const columns = [
      {
        Header: 'Name',
        accessor: 'firstName',
        Cell: row => {
          return (
            <PatientRow
              value={row.value}
              patient={row.original}
              redirect={() => {
                push(`/patients/${row.original.id}`);
              }}
            />
          );
        },
      },
      {
        Header: 'Age',
        id: 'birthDate',
        accessor: d => {
          const dateValue = moment().diff(d.birthDate, 'years');
          return Number.isInteger(dateValue) ? dateValue : '';
        }
      },
      {
        Header: 'Active',
        accessor: 'status',
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
      },
      {
        Header: 'Production Revenue',
        id: 'productionRevenue',
        accessor: d => {
          return d.hasOwnProperty('productionRevenue') ? `$${d.productionRevenue.toFixed(2)}` : '';
        },
      },
    ];

    return (
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.header_title}> All Patients </div>
          <div className={styles.header_subHeader}>
            Showing {this.state.totalPatients} Patients
          </div>
          <Button className={styles.addNewButton}>
            Add New Patient
          </Button>
        </div>
        <ReactTable
          data={this.state.data}
          page={this.state.currentPage}
          pages={Math.floor(this.state.totalPatients / this.state.limit)}
          sorted={this.state.sorted}
          defaultPageSize={this.state.limit}
          loading={this.state.loading && wasFetched}
          expanded={this.state.expanded}
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
          onFilteredChange={(column, value) => {
            this.onFilter(column, value);
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
          style={{
            height: 'calc(100vh - 230px)',
          }}
        />
      </div>
    )
  }
}

PatientTable.propTypes = {

};

function mapStateToProps({ apiRequests }) {
  const wasFetched = (apiRequests.get('patientTotalCount') ? apiRequests.get('patientTotalCount').wasFetched : null);

  return {
    wasFetched,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
    push,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientTable);
