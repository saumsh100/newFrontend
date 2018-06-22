
import React, { Component, PropTypes } from 'react';
import classname from 'classnames';
import Icon from '../Icon';
import styles from './styles.scss';

class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
    };
    this.setCollapsed = this.setCollapsed.bind(this);
  }

  setCollapsed() {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  render() {
    const {
      hasIcon,
      children,
      title,
      openIcon,
      closeIcon,
      wrapperClass,
      titleClass,
      contentClass,
      activeClass,
    } = this.props;

    const iconToOpen = openIcon || 'plus';
    const iconToClose = closeIcon || 'minus';
    const showCollapsed = this.state.isExpanded ? children : null;
    const icon = this.state.isExpanded ? iconToClose : iconToOpen;

    const wrapperStyle = wrapperClass
      ? classname(wrapperClass, styles.collapibleContainer)
      : styles.collapibleContainer;

    const titleStyle = titleClass
      ? classname(titleClass, styles.title)
      : styles.title;

    const titleStyleWithStatus =
      activeClass && this.state.isExpanded
        ? classname(titleStyle, activeClass)
        : titleStyle;

    const contentStyle = contentClass
      ? classname(contentClass, styles.collapsed)
      : styles.collapsed;

    return (
      <div className={wrapperStyle}>
        <div className={titleStyleWithStatus} onClick={this.setCollapsed}>
          {hasIcon && <Icon icon={icon} className={styles.icon} />}
          {title}
        </div>
        <div className={contentStyle}>
          <div className={styles.show}>{showCollapsed}</div>
        </div>
      </div>
    );
  }
}

Collapsible.defaultProps = {
  hasIcon: true,
};

Collapsible.propTypes = {
  hasIcon: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  openIcon: PropTypes.string,
  closeIcon: PropTypes.string,
  wrapperClass: PropTypes.string,
  titleClass: PropTypes.string,
  contentClass: PropTypes.string,
  activeClass: PropTypes.string,
};

export default Collapsible;
