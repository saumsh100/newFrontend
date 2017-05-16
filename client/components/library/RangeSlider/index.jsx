
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
      value: [30,45],
    };
    this.onRangeChange = this.onRangeChange.bind(this);
  }

  onRangeChange(value) {
    const test15 = value[1] - value[0];
    if(test15 < 15) {
      const newValue = [value[0], value[0] + 15];
      this.setState({
        value: newValue,
      });

    } else {
      this.setState({
        value,
      });
    }
  }

  render() {
    const {
      label,
      unit,
      max,
    } = this.props;


    const newProps = omit(this.props, ['value',]);

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
          pushable
          count={1}
          {...this.props}
        />
      </div>
    );
  }
}

export default RangeSlider;
