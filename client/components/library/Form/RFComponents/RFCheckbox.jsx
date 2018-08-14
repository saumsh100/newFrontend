
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Checkbox from '../../Checkbox';

class RFCheckbox extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const { input } = this.props;

    input.onChange(!input.value);
  }

  render() {
    const {
      input, icon, label, error, meta, flipped,
    } = this.props;

    const { touched, asyncValidating, dirty } = meta;
    const finalError = error || (touched || dirty ? meta.error : null);
    const finalIcon = asyncValidating ? (
      <i className="fa fa-cog fa-spin fa-fw" />
    ) : (
      icon
    );
    const checked = flipped ? !input.value : input.value;

    return (
      <Checkbox
        {...this.props}
        {...input}
        checked={checked}
        label={label}
        error={finalError}
        icon={finalIcon}
        onChange={e => input.onChange(!input.value)}
      />
    );
  }
}

/* eslint react/forbid-prop-types: 0 */
RFCheckbox.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.string,
  flipped: PropTypes.bool,
};

export default RFCheckbox;
