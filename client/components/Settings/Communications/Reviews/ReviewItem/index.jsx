
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ordinalSuffix, intervalToNumType, numTypeToInterval } from '../../../../../../server/util/time';
import {
  updateEntityRequest,
} from '../../../../../thunks/fetchEntities';
import {
  Icon,
  Grid,
  Row,
  Col,
  Input,
  DropdownSelect,
} from '../../../../library';
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
  { label: 'Hours', value: 'hours' },
  { label: 'Days', value: 'days' },
];

const primaryTypesOptions = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  // { label: 'Voice', value: 'phone' },
  { label: 'Email & SMS', value: 'email_sms' },
];

function SmallIconCircle(props) {
  const { selected, icon } = props;

  const wrapperClass = selected ?
    styles.smallReviewSelectWrapperCircleSelected :
    styles.smallReviewSelectWrapperCircle;

  return (
    <div className={wrapperClass}>
      {icon ? <Icon icon={icon} type="solid" /> : null}
    </div>
  );
}

class ReviewItem extends Component {
  constructor(props) {
    super(props);

    const { num, type } = intervalToNumType(props.reviewSettings.interval);

    this.state = {
      number: num,
      intervalType: type,
    };
  }

  componentWillUpdate(nextProps) {
    // Need function to abstract
    const oldNumType = intervalToNumType(this.props.reviewSettings.interval);
    const newNumType = intervalToNumType(nextProps.reviewSettings.interval);
    if (oldNumType.num === newNumType.num) {
      return;
    }

    this.setState({
      number: newNumType.num,
      intervalType: newNumType.type,
    });
  }

  updateNumberInput(event) {
    const val = event.target.value;

    // \D = all non digits
    let cleanVal = val.replace(/\D/g, '');

    // If zero, default to 1
    if (parseInt(cleanVal) === 0) {
      cleanVal = 1;
    }

    return this.setState({ number: cleanVal || 1 });
  }

  onChangeInterval(newType) {
    const { reviewSettings } = this.props;
    const { type } = intervalToNumType(reviewSettings.interval);
    if (newType === type) {
      return;
    }

    this.setState({
      intervalType: newType,
    }, () => {
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

  updateInterval() {
    // TODO add API CALL
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

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/review`,
      values: { interval: numTypeToInterval(number, intervalType) },
      alert,
    });
  }

  renderLabel() {
    return <TouchPointLabel title={'Review Request'} className={styles.reviewLabel} />;
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
          <IconCircle
            icon={icon}
            selected={selected}
            color={'yellow'}
          />
        </div>
        <div className={selected ? styles.secondaryLinesBoxSelected : styles.secondaryLinesBox}>
          <div className={styles.smallIconContainer}>
            <SmallIconCircle
              icon="bell"
              selected={selected}
            />
          </div>
          <div className={styles.dropdownsWrapper}>
            <div className={styles.topRow}>
              <DropdownSelect
                onChange={() => {}}
                className={dropdownSelectClass}
                value={primaryTypesKey}
                options={primaryTypesOptions}
                disabled={true}
              />
            </div>
            <div className={styles.bottomRow}>
              <Grid>
                <Row>
                  <Col xs={3}>
                    <Input
                      classStyles={dropdownSelectClass}
                      value={number}
                      onChange={this.updateNumberInput.bind(this)}
                      onBlur={this.onIntervalNumberBlur.bind(this)}
                      disabled={true}
                    />
                  </Col>
                  <Col xs={9} className={styles.rightDropdown}>
                    <DropdownSelect
                      onChange={this.onChangeInterval.bind(this)}
                      className={dropdownSelectClass}
                      value={type}
                      options={typeOptions}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Grid>
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
        color={'yellow'}
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
  selected: PropTypes.bool,
  account: PropTypes.shape({}).isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(ReviewItem);
