
import React, { Component, PropTypes } from 'react';
import omit from 'lodash/omit';
import RangeSlider from '../../RangeSlider';

class RFRangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [30,45],
    };
    this.onRangeChange = this.onRangeChange.bind(this);
  }

  onRangeChange(value) {
    const { input } = this.props;
    const test15 = value[1] - value[0];
    if(test15 < 15) {
      const newValue = [value[0], value[0] + 15];
      this.setState({
        value: newValue,
      });

      input.onChange(newValue)
    } else {
      this.setState({
        value,
      });
      input.onChange(value)
    }
  }

  render() {
    const {
      input,
      error,
      meta,
      max,
    } = this.props;

    const { touched, dirty } = meta;
    const finalError = error || ((touched || dirty) ? meta.error : null);
    const newProps = omit(this.props, ['input', 'meta']);
    const newInput = omit(input, ['value']);

    const maximumTrackStyle = {
      backgroundColor: '#ff715a',
      width: `${((this.state.value[0] - 15)/(max - 15)) * 100}%`,
    };

    return (
      <RangeSlider
        value={[this.state.value[0], this.state.value[1]]}
        pushable
        count={1}
        onChange={this.onRangeChange}
        {...newProps}
        maximumTrackStyle={maximumTrackStyle}
        error={finalError}
      />
    );
  }
}

/* eslint react/forbid-prop-types: 0 */
RFRangeSlider.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
};

export default RFRangeSlider;
