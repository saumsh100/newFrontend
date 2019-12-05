
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import omit from 'lodash/omit';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.onRangeChange = this.onRangeChange.bind(this);
  }

  componentDidMount() {
    const { setRangeState } = this.props;
    if (setRangeState) {
      this.setState({ value: setRangeState });
    }
  }

  onRangeChange(value) {
    const duration = this.state.value[0];
    const buffer = this.state.value[1];

    if (buffer === value[1]) {
      const newValue = [value[0], value[0] + (buffer - duration)];
      this.setState({ value: newValue });
      this.props.onChange(newValue);
    } else if (value[1] === value[0] + 1) {
      const newValue = [value[0], value[0]];
      this.setState({ value: newValue });
      this.props.onChange(newValue);
    } else {
      this.setState({ value });
      this.props.onChange(value);
    }
  }

  render() {
    const { max, min } = this.props;

    const maximumTrackStyle = {
      backgroundColor: '#ff715a',
      width: `${((this.props.value[0] - min) / (max - min)) * 100}%`,
    };

    const newProps = omit(this.props, ['onChange']);

    return (
      <div>
        <Range
          pushable
          allowCross
          count={1}
          onChange={this.props.onChange}
          maximumTrackStyle={maximumTrackStyle}
          {...newProps}
        />
      </div>
    );
  }
}

RangeSlider.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  setRangeState: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
};

export default RangeSlider;
