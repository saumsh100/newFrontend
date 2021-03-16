
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { intervalToNumType } from '../../../../../util/isomorphic';
import { updateEntityRequest } from '../../../../../thunks/fetchEntities';
import { Toggle } from '../../../../library';
import { convertPrimaryTypesToKey } from '../../../Shared/util/primaryTypes';
import IconCircle from '../../../Shared/IconCircle';
import TouchPointItem, { TouchPointLabel } from '../../../Shared/TouchPointItem';
import Account from '../../../../../entities/models/Account';
import Recall from '../../../../../entities/models/Recall';
import styles from './styles.scss';

const iconsMap = {
  sms: 'comment',
  smart_follow_up: 'comment',
  phone: 'phone',
  email: 'envelope',
  email_sms: 'envelope_comment',
};

const wordMap = {
  sms: 'SMS',
  smart_follow_up: 'Smart Follow Up',
  phone: 'Voice',
  email: 'Email',
  email_sms: 'Email & SMS',
};

const singularType = {
  weeks: 'Week',
  months: 'Month',
};

const pluralType = {
  weeks: 'Weeks',
  months: 'Months',
};

const getTypeWord = (num, type) => {
  if (Math.abs(num) === 1) {
    return singularType[type];
  }
  return pluralType[type];
};

class RecallsItem extends Component {
  constructor(props) {
    super(props);

    const { num } = intervalToNumType(props.recall.interval);

    // This is more for the input if we had one...
    this.state = { number: num };

    this.changeIsActive = this.changeIsActive.bind(this);
    this.deleteRecall = this.deleteRecall.bind(this);
    this.changePrimaryType = this.changePrimaryType.bind(this);
  }

  componentDidMount() {
    // Need function to abstract
    const { num } = intervalToNumType(this.props.recall.interval);
    if (this.state.number === num) {
      return;
    }

    this.setState({ number: num });
  }

  changeIsActive(e) {
    const isActive = e.target.checked;
    const { recall, account } = this.props;
    const word = isActive ? 'active' : 'inactive';

    const alert = {
      success: {
        title: 'Updated Recall',
        body: `Set the recall to ${word}`,
      },

      error: {
        title: 'Error Updating Recall',
        body: `Failed to set the recall to ${word}`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/recalls/${recall.id}`,
      values: { isActive },
      alert,
    });
  }

  deleteRecall(e) {
    // So that it doesn't bubble up and try to select this reminder
    e.stopPropagation();
    e.preventDefault();
    const { recall, account, selected, selectRecall } = this.props;
    const { num, type } = intervalToNumType(recall.interval);
    const subType = num >= 0 ? 'before' : 'after';
    const sure = window.confirm(
      `Are you sure you want to delete the ${num} ${type} ${subType} due date recall?`,
    );
    if (!sure) {
      return;
    }

    if (selected) {
      selectRecall(null);
    }

    const alert = {
      success: {
        title: 'Deleted Recall',
        body: `You have deleted the ${num} ${type} ${subType} due date recall`,
      },

      error: {
        title: 'Error Deleting Recall',
        body: `Failed to delete the ${num} ${type} ${subType} due date recall`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/recalls/${recall.id}`,
      values: { isDeleted: true },
      alert,
    });
  }

  changePrimaryType(value) {
    const { recall, account } = this.props;
    const word = wordMap[value];
    const primaryTypes = value.split('_');

    const alert = {
      success: {
        title: 'Updated Recall',
        body: `Set the primary communication type to ${word}`,
      },

      error: {
        title: 'Error Updating Recall',
        body: `Failed to set the recall's primary communication type to ${word}`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/recalls/${recall.id}`,
      values: { primaryTypes },
      alert,
    });
  }

  render() {
    const { recall, selected, selectRecall, lastRecall, index } = this.props;

    const { interval, primaryTypes, isActive } = recall;

    const primaryTypesKey = convertPrimaryTypesToKey(primaryTypes);

    const icon = iconsMap[primaryTypesKey];
    const { num, type } = intervalToNumType(interval);
    const subType = num >= 0 ? 'before' : 'after';

    // Pretty hacky way to decide length, should convert interval to days and use that
    let color = 'green';
    if (num < 0 && num >= -6) {
      color = 'yellow';
    } else if (num < -6) {
      color = 'red';
    }

    const primaryTypeClass = classNames(styles.primaryType, {
      [styles[`primaryType_${color}`]]: selected,
    });

    return (
      <TouchPointItem
        noLines={lastRecall}
        selected={selected}
        color={color}
        className={styles.recallListItem}
        toggleClass={styles.toggleClass}
        labelClass={styles.labelClass}
        linesBoxClass={styles.linesBoxClass}
        connectLinesClass={styles.connectLinesClass}
        onClick={() => selectRecall(recall.id)}
        toggleComponent={<Toggle color={color} checked={isActive} onChange={this.changeIsActive} />}
        labelComponent={
          <div className={styles.recallLabel}>
            <TouchPointLabel
              title={`${Math.abs(num)} ${getTypeWord(num, type)}`}
              data-test-id={`touchPoint_recall_${index}`}
            />
            <div className={styles.beforeAfterLabel}>{subType} due date</div>
          </div>
        }
        mainComponent={
          <div>
            <div className={styles.reminderIconContainer}>
              <IconCircle icon={icon} selected={selected} color={color} />
              <div className={styles.typeWrapper}>
                <div className={primaryTypeClass}>{wordMap[primaryTypesKey]}</div>
              </div>
            </div>
          </div>
        }
      />
    );
  }
}

RecallsItem.propTypes = {
  selectRecall: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  recall: PropTypes.instanceOf(Recall).isRequired,
  account: PropTypes.instanceOf(Account).isRequired,
  selected: PropTypes.bool,
  index: PropTypes.number.isRequired,
  lastRecall: PropTypes.bool,
};

RecallsItem.defaultProps = {
  selected: false,
  lastRecall: false,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateEntityRequest }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(RecallsItem);
