import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';

import Tab from './Tab';
import TabContent from './TabContent';
import styles from './reskin-styles.scss';

// Workaround to be able compare class with type
// https://github.com/gaearon/react-hot-loader/issues/304
const tabType = (<Tab />).type;

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.handleTabClick = this.handleTabClick.bind(this);
    this.parseChildren = this.parseChildren.bind(this);
    this.renderHeaders = this.renderHeaders.bind(this);
    this.renderContents = this.renderContents.bind(this);
  }

  handleTabClick(index) {
    this.props.onChange && this.props.onChange(index);
  }

  parseChildren(children) {
    const headers = [];
    const contents = [];

    Children.forEach(children, (item) => {
      if (item.type === tabType) {
        headers.push(item);
        if (item.props.children) {
          contents.push(<TabContent>{item.props.children}</TabContent>);
        }
      }
    });

    return {
      headers,
      contents,
    };
  }

  renderHeaders(headers, fluid) {
    return headers.map((item, idx) =>
      React.cloneElement(item, {
        fluid,
        key: idx.toString(),
        index: idx,
        active: this.props.index === idx,
        onClick: (event, index) => {
          item.props.onClick && item.props.onClick(event);
          if (item.props.disabled) return;
          this.handleTabClick(index);
        },

        noUnderLine: this.props.noUnderLine,
      }),);
  }

  renderContents(contents) {
    const contentElements = contents.map((item, idx) =>
      React.cloneElement(item, {
        key: idx.toString(),
        active: this.props.index === idx,
        tabIndex: idx,
        noUnderLine: this.props.noUnderLine,
      }),);

    return contentElements.filter((item, idx) => idx === this.props.index);
  }

  render() {
    const { children, className, contentClass, navClass, noHeaders, fluid } = this.props;

    const newProps = omit(this.props, [
      'index',
      'navClass',
      'contentClass',
      'noUnderLine',
      'fluid',
      'noHeaders',
    ]);

    const classes = classNames(className, styles.tabs);
    const contentClasses = classNames(contentClass, styles.content);
    const { headers, contents } = this.parseChildren(children);

    return (
      // Order is important, classNames={classes} needs to override props.className
      <div {...newProps} className={classes}>
        {!noHeaders && (
          <nav className={classNames(navClass, styles.nav)}>
            {this.renderHeaders(headers, fluid)}
          </nav>
        )}
        <div className={contentClasses}>{this.renderContents(contents)}</div>
      </div>
    );
  }
}

Tabs.propTypes = {
  className: PropTypes.string,
  contentClass: PropTypes.string,
  navClass: PropTypes.string,
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  noHeaders: PropTypes.bool,
  noUnderLine: PropTypes.bool,
  fluid: PropTypes.bool,
};

Tabs.defaultProps = {
  className: null,
  contentClass: null,
  navClass: null,
  disabled: false,
  noHeaders: false,
  noUnderLine: false,
  fluid: false,
  onChange: (e) => e,
};

export default Tabs;
export { Tab };
