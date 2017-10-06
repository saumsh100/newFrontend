import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { batchActions } from 'redux-batched-actions';
import { fetchEntities, updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Header, Toggle } from '../../../library';
import { SortByName } from '../../../library/util/SortEntities';
import styles from './styles.scss';
import ChairsForm from './ChairsForm';


function checkValues(obj) {
  const allTrue = Object.keys(obj).every((key) => {
    return obj[key].isActive;
  });
  return allTrue;
}

function createInitialValues(practitionerIds, practitioners) {
  return practitioners.map(p => {
    return practitionerIds.indexOf(p.get('id')) > -1;
  }).toJS();
}

class Chairs extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAllChairs = this.setAllChairs.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({
      key: 'chairs',
    });
  }

  handleSubmit(values) {
    console.log(values);
  }

  setAllChairs(e) {
    e.stopPropagation();
    const { change, chairs, allChairs } = this.props;

    console.log(allChairs);
    const actions = Object.keys(chairs.toJS()).map((key) => {
      return change('chairsForm', key, !allChairs);
    });

    this.props.dispatch(batchActions(actions));
  }

  render() {
    const {
      chairs,
      allChairs,
    } = this.props;

    if (!chairs) {
      return null;
    }

    const sortedChairs = chairs.sort(SortByName).toArray();
    console.log(allChairs);

    return (
      <div>
        <div className={styles.headerContainer}>
          <Header title={'Chairs'} />
        </div>
        <div>
          <span> All Chairs </span>
          <Toggle
            name="allChairs"
            onChange={this.setAllChairs}
          />
        </div>
        {sortedChairs.length ? <ChairsForm
          chairs={sortedChairs}
          handleSubmit={this.handleSubmit}
        /> : null }
      </div>
    );
  }
}

Chairs.propTypes = {
  chairs: PropTypes.object,
  fetchEntities: PropTypes.func.required,
  updateEntityRequest: PropTypes.func.required,
};

function mapStateToProps({ entities, form }) {
  const chairs = entities.getIn(['chairs', 'models']);

  if (!form['chairsForm']) {
    return {
      allChairs: null,
      chairs,
    };
  }

  return {
    chairs,
    allChairs: checkValues(chairs.toJS()),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    updateEntityRequest,
    change,
    dispatch,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Chairs);
