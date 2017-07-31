import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SelectPill extends PureComponent {
  constructor(props) {
    super(props);

    this.onPillClick = this.onPillClick.bind(this);
    this.state = {
      selectedPills: {},
    };
  }

  onPillClick(pillId) {
    if (!this.props.multiselect) {
      this.setState({
        selectedPills: {
          [pillId]: true,
        },
      });

      this.props.onChange({
        [pillId]: true,
      });
    } else {
      this.setState({
        selectedPills: {
          ...this.state.selectedPills,
          [pillId]: !this.state.selectedPills[pillId],
        },
      });
      this.props.onChange({
        ...this.state.selectedPills,
        [pillId]: !this.state.selectedPills[pillId],
      });
    }
  }

  render() {
    console.log(this.state);
    const childrenWithProps = React.Children.map(this.props.children,
      child => React.cloneElement(child, {
        onClick: pillId => this.onPillClick(pillId),
        selected: this.state.selectedPills[child.props.pillId],
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
};

SelectPill.defaultProps = {
  onChange: () => {},
  multiselect: false,
};

export default SelectPill;
 
