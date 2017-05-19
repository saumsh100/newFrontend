
import React, { PropTypes, Component } from 'react';
import Checkbox from '../../Checkbox';

class RFCheckbox extends Component {
  constructor(props) {
    super(props);
    const checked = this.props.input.value || false;
    this.state = {
      checked,
    };
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(e) {
    const {
      input,
    } = this.props;

    input.onChange(!this.state.checked);

    this.setState({
      checked: !this.state.checked,
    });
  }

  render() {
    const {
      input,
      icon,
      label,
      error,
      meta,
      flipped,
    } = this.props;

    const { touched, asyncValidating, dirty } = meta;
    const finalError = error || ((touched || dirty) ? meta.error : null);
    const finalIcon = asyncValidating ? (<i className={'fa fa-cog fa-spin fa-fw'} />) : icon;

    return (
      <Checkbox
        {...this.props}
        {...input}
        checked={this.state.checked}
        label={label}
        error={finalError}
        icon={finalIcon}
        onChange={this.handleChange}
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
