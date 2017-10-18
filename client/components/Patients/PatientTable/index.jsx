import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { fetchEntities } from '../../../thunks/fetchEntities';
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
      pages: 0,
      currentPage: 0,
      dataArray: [],
      loading: true,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(state, instance) {
    console.log(state);
    if (state.page === 0 || state.page === this.state.currentPage ) {
      const limit = state.pageSize * (state.page + 1);
      console.log(limit);
      const query = {
        limit,
        page: state.page,
        filter: state.filtered,
        sort: state.sorted,
      };

      return this.props.fetchEntities({
        key: 'patients',
        url: '/api/patients/table',
        params: query,
      }).then((data) => {
        const dataArray = getEntities(data);

        this.setState({
          dataArray,
          data: dataArray.slice(state.pageSize * state.page, state.pageSize * state.page + state.pageSize),
          pages: Math.ceil(dataArray.length / state.pageSize) + 1,
          currentPage: Math.ceil(dataArray.length / state.pageSize),
          loading: false,
        });
      });
    } else {
      this.setState({
        data: this.state.dataArray.slice(state.pageSize * state.page, state.pageSize * state.page + state.pageSize),
      });
    }
  }

  render() {
    const {
      patients,
    } = this.props;

    if (!patients) {
      return null;
    }

    const columns = [{
      Header: 'First Name',
      id: 'firstName',
      accessor: d => d.firstName,
    }, {
      Header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName,
    },
    ];

    return (
      <div className={styles.mainContainer}>
        <ReactTable
          data={this.state.data}
          pages={this.state.pages}
          columns={columns}
          filterable
          defaultPageSize={20}
          loading={this.state.loading}
          className="-striped -highlight"
          onFetchData={this.fetchData}
          manual
          geTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                console.log('A Td Element was clicked!')
                console.log('it produced this event:', e)
                console.log('It was in this column:', column)
                console.log('It was in this row:', rowInfo)
                console.log('It was in this table instance:', instance)

                // IMPORTANT! React-Table uses onClick internally to trigger
                // events like expanding SubComponents and pivots.
                // By default a custom 'onClick' handler will override this functionality.
                // If you want to fire the original onClick handler, call the
                // 'handleOriginal' function.
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

function mapStateToProps({ entities }) {
  const patients = entities.getIn(['patients', 'models']).toArray();
  return {
    patients,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientTable);
