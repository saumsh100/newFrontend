import React, { Component, PropTypes } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
    return (
      <div>
        <Range
          onAfterChange={this.onAfterChange}
          {...this.props}
        />
        {this.state.value}
      </div>
    );
  }
}

export default RangeSlider;
