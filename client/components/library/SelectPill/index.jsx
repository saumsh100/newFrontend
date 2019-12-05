
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

  onPillClick(pillId) {
    if (!this.props.multiselect) {
      if (this.state.selectedPills[0] === pillId) {
        this.setState({
          selectedPills: [],
        });
        this.props.onChange([]);
      } else {
        this.setState({
          selectedPills: [pillId],
        });
        this.props.onChange([pillId]);
      }
    } else {
      const pills = new Set([...this.state.selectedPills]);

      if (pills.has(pillId)) {
        pills.delete(pillId);
      } else {
        pills.add(pillId);
      }
      const change = [...pills];
      this.setState({
        selectedPills: change,
      });
      this.props.onChange(change);
    }
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onClick: pillId => this.onPillClick(pillId),
        selected: this.state.selectedPills.includes(child.props.pillId),
      }));
    return <div>{childrenWithProps}</div>;
  }
}

SelectPill.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func,
  multiselect: PropTypes.bool,
};

SelectPill.defaultProps = {
  onChange: () => {},
  multiselect: false,
};

export default SelectPill;
