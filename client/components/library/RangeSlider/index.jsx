
import React, { Component, PropTypes } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './styles.scss';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider);

class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.onAfterChange = this.onAfterChange.bind(this);
  }

  onAfterChange(value) {
    this.setState({
      value,
    });
  }

  render() {

    const {
      label,
      unit
    } = this.props;

    return (
      <div>
        <div className={styles.label}>
          <div>{label}</div>
          <div className={styles.label_valueUnit}>{this.state.value}{unit}</div>
        </div>
        <Range
          onAfterChange={this.onAfterChange}
          {...this.props}
        />
      </div>
    );
  }
}

export default RangeSlider;
