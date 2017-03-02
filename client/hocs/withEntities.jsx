
import React, { Component, PropTypes } from 'react';

/**
 * withHoverable is a HOC that gives BasicComponent the following props
 * {
 *    isHovered: BOOLEAN,
 * }
 * @param BasicComponent
 * @returns BasicComponent with the isHovered prop
 */
export default function withEntities(data) {
  return (BasicComponent) => {
    class LoadedComponent extends Component {
      constructor(props) {
        super(props);

        this.fetchEntities = this.fetchEntities.bind(this);
      }

      componentDidMount() {
        this.fetchEntities();
      }

      componentWillReceiveProps(nextProps) {
        this.fetchEntities(nextProps);
      }

      fetchEntities(newProps) {

      }

      render() {
        const { isHovered } = this.state;
        return (
          <div
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseLeave}
          >
            <BasicComponent
              {...this.props}
              isHovered={isHovered}
            />
          </div>
        );
      }
    }

    LoadedComponent.propTypes = {
      fetchEntities,
      entities,
    };

    function mapStateToProps() {

    }

    function mapDispatchToProps() {

    }

    return connect(mapStateToProps, mapDispatchToProps)(LoadedComponent);
  };
}
