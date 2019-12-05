
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { batchActions } from 'redux-batched-actions';
import { fetchEntities, updateEntityRequest } from '../../../../thunks/fetchEntities';
import { showAlertTimeout } from '../../../../thunks/alerts';
import { Toggle } from '../../../library/index';
import { SortByName } from '../../../library/util/SortEntities';
import { chairShape } from '../../../library/PropTypeShapes';
import SettingsCard from '../../Shared/SettingsCard';
import ChairsForm from './ChairsForm';
import styles from './styles.scss';

function checkValues(obj) {
  return Object.keys(obj).every(key => obj[key]);
}

function createInitialValues(chairs) {
  const obj = {};
  chairs.forEach((chair) => {
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

  componentDidMount() {
    this.props.fetchEntities({
      key: 'chairs',
    });
  }

  setAllChairs(e) {
    e.stopPropagation();
    const { chairs } = this.props;

    const actions = Object.keys(chairs.toJS()).map(key =>
      this.props.change('chairsForm', key, !this.props.allChairs));

    this.props.dispatch(batchActions(actions));
  }

  handleSubmit(chairArray, previousValues) {
    const { chairs } = this.props;

    chairArray.map((id) => {
      const chair = chairs.get(id);
      const modifiedService = chair.set('isActive', !chair.get('isActive'));

      if (chairArray.length === 1) {
        const alert = {
          success: {
            body: ` ${chair.get('name')} was updated.`,
          },
          error: {
            body: `Could not update ${chair.get('name')}.`,
          },
        };

        return this.props
          .updateEntityRequest({ key: 'chairs',
            model: modifiedService,
            alert })
          .then(() => {
            this.setState({
              previousValues,
            });
          });
      }

      return this.props.updateEntityRequest({ key: 'chairs',
        model: modifiedService }).then(() => {
        this.setState({
          previousValues,
        });
      });
    });
  }

  render() {
    const { chairs } = this.props;

    if (!chairs) {
      return null;
    }

    const sortedChairs = chairs.sort(SortByName).toArray();

    const initialValues = createInitialValues(sortedChairs);

    if (!Object.keys(initialValues).length) {
      return null;
    }

    return (
      <SettingsCard title="Chairs" bodyClass={styles.chairsBody}>
        <div className={styles.container}>
          <div className={styles.allChairs}>
            <span className={styles.allChairs_text}> All Chairs Active </span>
            <Toggle name="allChairs" onChange={this.setAllChairs} checked={this.props.allChairs} />
          </div>
          {sortedChairs.length > 0 && (
            <ChairsForm
              chairs={sortedChairs}
              handleSubmit={this.handleSubmit}
              initialValues={initialValues}
              formValues={this.state.previousValues}
            />
          )}
        </div>
      </SettingsCard>
    );
  }
}

Chairs.propTypes = {
  chairs: PropTypes.shape(chairShape).isRequired,
  fetchEntities: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  allChairs: PropTypes.bool,
  change: PropTypes.func.isRequired,
};

Chairs.defaultProps = {
  allChairs: false,
};

function mapStateToProps({ entities, form }) {
  const chairs = entities.getIn(['chairs', 'models']);

  if (!form.chairsForm) {
    return {
      allChairs: null,
      chairs,
      values: {},
    };
  }

  return {
    chairs,
    allChairs: checkValues(form.chairsForm.values),
    values: form.chairsForm.values,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      updateEntityRequest,
      showAlertTimeout,
      change,
      dispatch,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chairs);
