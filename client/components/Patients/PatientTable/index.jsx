import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { fetchEntities, fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import PatientSubComponent from './PatientSubComponent';
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
      limit: 20,
      loading: true,
      totalPatients: 0,
      currentPage: 0,
      data: [],
      sorted: [],
    };
    this.fetchData = this.fetchData.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSort = this.onSort.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
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
        page: 0,
      });
    });
  }

  fetchData(setQuery) {
    const query = {
      limit: this.state.limit,
      sort: this.state.sorted,
      ...setQuery
    };

    console.log(query)
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
      page: index,
    });
    this.setState({
      currentPage: index,
    });
  }

  pageSizeChange(pageSize, pageIndex) {
    this.setState({
      limit: pageSize,
    });
    fetchData({
      page: pageIndex
    });
  }

  onFilter(column, value) {
    this.fetchData({
      filter: column,
      page: 0,
    });
  }

  onSort(newSorted) {
    this.fetchData({
      sort: newSorted,
      page: 0,
    });
    this.setState({
      sorted: newSorted,
    });
  }

  render() {
    const {
      wasFetched,
      push,
    } = this.props;

    if (!wasFetched) {
      return null;
    }

    const columns = [
      {
        Header: 'First Name',
        accessor: 'firstName',
      }, {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Active',
        accessor: 'status',
      },
      {
        Header: 'Age',
        id: 'birthDate',
        accessor: d => moment().diff(d.birthDate, 'years'),
      },
    ];

    return (
      <div className={styles.mainContainer}>
        <ReactTable
          data={this.state.data}
          page={this.state.currentPage}
          pages={Math.floor(this.state.totalPatients / this.state.limit)}
          columns={columns}
          sorted={this.state.sorted}
          filterable
          defaultPageSize={this.state.limit}
          loading={this.state.loading}
          className="-striped -highlight"
          manual
          SubComponent={row => {
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
            this.onFilter(column, value)
          }}
          onSortedChange={(newSorted, column, shiftKey) => {
            this.onSort(newSorted);
          }}

          onPageSizeChange={(pageSize, pageIndex) => {
            this.pageSizeChange(pageSize, pageIndex)
          }}

          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                if(!column.expander) {
                  push(`/patients/${rowInfo.original.id}`)
                }
                if (handleOriginal) {
                  handleOriginal()
                }
              }
            }
          }}
        />
      </div>
    )
  }
}

PatientTable.propTypes = {

};

function mapStateToProps({ entities, apiRequests }, { match }) {
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
