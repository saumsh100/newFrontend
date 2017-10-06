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
    return obj[key];
  });
  return allTrue;
}

function createInitialValues(chairs) {
  const obj = {};
  chairs.map((chair) => {
    obj[chair.get('id')] = chair.get('isActive');
  });
  return obj;
}

class Chairs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previousValues: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAllChairs = this.setAllChairs.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({
      key: 'chairs',
    });
  }

  setAllChairs(e) {
    e.stopPropagation();
    const { change, chairs, allChairs } = this.props;

    const actions = Object.keys(chairs.toJS()).map((key) => {
      return change('chairsForm', key, !allChairs);
    });

    this.props.dispatch(batchActions(actions));
  }


  handleSubmit(chairArray, previousValues) {

    const {
      updateEntityRequest,
      chairs
    } = this.props;

    chairArray.map((id) => {
      const chair = chairs.get(id);
      const modifiedService = chair.set('isActive', !chair.get('isActive'));

      const alert = {
        success: {
          body: ` ${chair.get('name')} was updated.`,
        },
        error: {
          body: `Could not update ${chair.get('name')}.`,
        },
      };

      updateEntityRequest({ key: 'chairs', model: modifiedService, alert }).then(()=>{
        this.setState({
          previousValues,
        })
      });
    });

  }

  render() {
    const {
      chairs,
      allChairs,
      values,
    } = this.props;

    if (!chairs) {
      return null;
    }
    const sortedChairs = chairs.sort(SortByName).toArray();

    const initialValues = createInitialValues(sortedChairs)

    if (!Object.keys(initialValues).length) {
      return null;
    }

    return (
      <div>
        <div className={styles.headerContainer}>
          <Header title={'Set Active Chairs'} />
        </div>
        <div className={styles.allChairs}>
          <span className={styles.allChairs_text}> All Chairs </span>
          <Toggle
            name="allChairs"
            onChange={this.setAllChairs}
            checked={allChairs}
          />
        </div>
        {sortedChairs.length ? <ChairsForm
          chairs={sortedChairs}
          handleSubmit={this.handleSubmit}
          initialValues={initialValues}
          formValues={this.state.previousValues}
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
      values: {}
    };
  }

  return {
    chairs,
    allChairs: checkValues(form['chairsForm'].values),
    values: form['chairsForm'].values,
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
