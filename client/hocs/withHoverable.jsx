
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * withHoverable is a HOC that gives BasicComponent the following props
 * {
 *    isHovered: BOOLEAN,
 * }
 * @param BasicComponent
 * @returns BasicComponent with the isHovered prop
 */
export default function withHoverable(BasicComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isHovered: false,
      };

      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseOver(e) {
      if (!this.state.isHovered) {
        this.setState({ isHovered: true });
      }
    }

    handleMouseLeave(e) {
      if (this.state.isHovered) {
        this.setState({ isHovered: false });
      }
    }

    render() {
      const { isHovered } = this.state;
      return (
        <div
          onMouseOver={this.handleMouseOver}
          onMouseLeave={this.handleMouseLeave}
        >
          <BasicComponent {...this.props} isHovered={isHovered} />
        </div>
      );
    }
  };
}
