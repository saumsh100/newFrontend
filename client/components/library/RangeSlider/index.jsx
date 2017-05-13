
import React, { Component, PropTypes } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './styles.scss';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [30,60],
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
          <div className={styles.label_valueUnit}>
            <div  className={styles.label_valueUnit_duration}>{this.state.value[0]}{unit}</div>
            <div className={styles.label_labelBuffer}> Buffer </div>
            <div className={styles.label_valueUnit_buffer}>{this.state.value[1] - this.state.value[0]}{unit}</div>
          </div>
        </div>
        <Range
          defaultValue={[30,60]}
          pushable
          count={1}
          allowCross={false}
          onAfterChange={this.onAfterChange}
          {...this.props}
          minimumTrackStyle={{ backgroundColor: 'blue', height: 10 }}
        />
      </div>
    );
  }
}

export default RangeSlider;
