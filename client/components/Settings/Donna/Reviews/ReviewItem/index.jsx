
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { intervalToNumType, numTypeToInterval } from '@carecru/isomorphic';
import { updateReviewsSettings } from '../../../../../thunks/accounts';
import { Icon, Input, DropdownSelect } from '../../../../library';
import { convertPrimaryTypesToKey } from '../../../Shared/util/primaryTypes';
import IconCircle from '../../../Shared/IconCircle';
import TouchPointItem, { TouchPointLabel } from '../../../Shared/TouchPointItem';
import styles from './styles.scss';

const iconsMap = {
  sms: 'comment',
  phone: 'phone',
  email: 'envelope',
  email_sms: 'envelope_comment',
};

const typeOptions = [
  {
    label: 'Minutes',
    value: 'minutes',
  },
  {
    label: 'Hours',
    value: 'hours',
  },
  {
    label: 'Days',
    value: 'days',
  },
];

const primaryTypesOptions = [
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'SMS',
    value: 'sms',
  },
  // { label: 'Voice', value: 'phone' },
  {
    label: 'Email & SMS',
    value: 'email_sms',
  },
];

function SmallIconCircle(props) {
  const { selected, icon } = props;

  const wrapperClass = selected
    ? styles.smallReviewSelectWrapperCircleSelected
    : styles.smallReviewSelectWrapperCircle;

  return <div className={wrapperClass}>{icon ? <Icon icon={icon} type="solid" /> : null}</div>;
}

SmallIconCircle.propTypes = {
  selected: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
};

class ReviewItem extends Component {
  constructor(props) {
    super(props);

    const { num, type } = intervalToNumType(props.reviewSettings.interval);

    this.state = {
      number: num,
      intervalType: type,
    };

    this.onChangeInterval = this.onChangeInterval.bind(this);
    this.onIntervalNumberBlur = this.onIntervalNumberBlur.bind(this);
    this.updateNumberInput = this.updateNumberInput.bind(this);
  }

  onChangeInterval(newType) {
    const { reviewSettings } = this.props;
    const { type } = intervalToNumType(reviewSettings.interval);
    if (newType === type) {
      return;
    }

    this.setState({ intervalType: newType }, () => {
      this.updateInterval();
    });
  }

  onIntervalNumberBlur() {
    const { reviewSettings } = this.props;
    const { num } = intervalToNumType(reviewSettings.interval);

    if (num === this.state.number) {
      return;
    }

    this.updateInterval();
  }

  updateNumberInput(event) {
    const val = event.target.value;

    // \D = all non digits
    let cleanVal = val.replace(/\D/g, '');

    // If zero, default to 1
    if (parseInt(cleanVal, 10) === 0) {
      cleanVal = 1;
    }

    return this.setState({ number: cleanVal || 1 });
  }

  updateInterval() {
    const { account } = this.props;
    const { number, intervalType } = this.state;

    const alert = {
      success: {
        title: 'Updated Review Settings',
        body: `Set the review notification time to ${number} ${intervalType}`,
      },

      error: {
        title: 'Error Review Settings',
        body: `Failed to set the review notification time to ${number} ${intervalType}`,
      },
    };

    this.props.updateReviewsSettings(
      account.id,
      { reviewsInterval: numTypeToInterval(number, intervalType) },
      alert,
    );
  }

  renderLabel() {
    return <TouchPointLabel title="Review Request" className={styles.reviewLabel} />;
  }

  renderMainComponent() {
    const { selected, reviewSettings } = this.props;
    const { primaryTypes, interval } = reviewSettings;
    const primaryTypesKey = convertPrimaryTypesToKey(primaryTypes);
    const icon = iconsMap[primaryTypesKey];
    const { number } = this.state;
    const dropdownSelectClass = selected ? styles.dropdownSelectSelected : styles.dropdownSelect;
    const { type } = intervalToNumType(interval);

    return (
      <div>
        <div className={styles.reviewIconContainer}>
          <IconCircle icon={icon} selected={selected} color="yellow" />
        </div>
        <div className={selected ? styles.secondaryLinesBoxSelected : styles.secondaryLinesBox}>
          <div className={styles.smallIconContainer}>
            <SmallIconCircle icon="bell" selected={selected} />
          </div>
          <div className={styles.dropdownsWrapper}>
            <div className={styles.topRow}>
              <DropdownSelect
                disabled
                onChange={() => {}}
                className={dropdownSelectClass}
                value={primaryTypesKey}
                options={primaryTypesOptions}
              />
            </div>
            <div className={styles.bottomRow}>
              <div className={styles.bottomRowLeft}>
                <Input
                  classStyles={dropdownSelectClass}
                  value={number}
                  onChange={this.updateNumberInput}
                  onBlur={this.onIntervalNumberBlur}
                />
              </div>
              <div className={styles.bottomRowRight}>
                <DropdownSelect
                  onChange={this.onChangeInterval}
                  className={dropdownSelectClass}
                  value={type}
                  options={typeOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { selected } = this.props;
    return (
      <TouchPointItem
        selected={selected}
        noLines
        color="yellow"
        className={styles.reviewListItem}
        onClick={() => this.props.onSelect()}
        toggleComponent={null}
        labelComponent={this.renderLabel()}
        mainComponent={this.renderMainComponent()}
        rightComponent={null}
      />
    );
  }
}

ReviewItem.propTypes = {
  onSelect: PropTypes.func.isRequired,
  reviewSettings: PropTypes.shape({
    interval: PropTypes.string,
    primaryType: PropTypes.string,
    primaryTypes: PropTypes.array,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  account: PropTypes.shape({}).isRequired,
  updateReviewsSettings: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateReviewsSettings }, dispatch);
}

const enhance = connect(
  null,
  mapDispatchToProps,
);

export default enhance(ReviewItem);
