
import React, { Component, PropTypes } from 'react';
import Slider from 'rc-slider';
import omit from 'lodash/omit';
import 'rc-slider/assets/index.css';
import styles from './styles.scss';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValues,
    };
    this.onRangeChange = this.onRangeChange.bind(this);
  }

  componentWillMount() {
    const {
      setRangeState
    } = this.props;
    if (setRangeState) {
      this.setState({ value: setRangeState });
    }
  }

  onRangeChange(value) {
    const duration = this.state.value[0];
    const buffer = this.state.value[1];

    if(buffer === value[1]) {
      const newValue = [value[0], value[0] + (buffer - duration)];
      this.setState({
        value: newValue,
      });
      this.props.onChange(newValue);
    } else {
      this.setState({
        value,
      });
      this.props.onChange(value);
    }
  }

  render() {
    const {
      label,
      unit,
      max,
    } = this.props;

    const maximumTrackStyle = {
      backgroundColor: '#ff715a',
      width: `${((this.state.value[0] - 15)/(max - 15)) * 100}%`,
    };

    const newProps = omit(this.props, ['onChange']);

    return (
      <div>
        <div className={styles.label}>
          <div>{label}</div>
          <div className={styles.label_valueUnit}>
            <div className={styles.label_valueUnit_duration}>{this.state.value[0]}{unit}</div>
            <div className={styles.label_labelBuffer}> Buffer </div>
            <div className={styles.label_valueUnit_buffer}>
              {this.state.value[1] - this.state.value[0]}{unit}
            </div>
          </div>
        </div>
        <Range
          value={[this.state.value[0], this.state.value[1]]}
          pushable
          count={1}
          onChange={this.onRangeChange}
          maximumTrackStyle={maximumTrackStyle}
          {...newProps}
        />
      </div>
    );
  }
}

export default RangeSlider;
