import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SelectPill extends PureComponent {
  constructor(props) {
    super(props);

    this.onPillClick = this.onPillClick.bind(this);
    this.state = {
      selectedPills: [],
    };
  }

  componentWillReceiveProps(props) {
    if (props.selected) {
      this.state = {
        selectedPills: props.selected,
      };
    }
  }

  onPillClick(pillId) {
    if (!this.props.multiselect) {
      this.setState({
        selectedPills: [pillId],
      });

      this.props.onChange([pillId]);
    } else {
      const change = [
        ...new Set([
          ...this.state.selectedPills,
          pillId,
        ]),
      ];
      this.setState({
        selectedPills: change,
      });
      this.props.onChange(change);
    }
  }

  render() {
    console.log(this.state);
    const childrenWithProps = React.Children.map(this.props.children,
      child => React.cloneElement(child, {
        onClick: pillId => this.onPillClick(pillId),
        selected: this.state.selectedPills.includes(child.props.pillId),
      })
    );
    return (
      <div>{childrenWithProps}</div>
    );
  }
}

SelectPill.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func,
  multiselect: PropTypes.bool,
  selected: PropTypes.arrayOf(PropTypes.string),
};

SelectPill.defaultProps = {
  onChange: () => {},
  multiselect: false,
  selected: [],
};

export default SelectPill;
 
