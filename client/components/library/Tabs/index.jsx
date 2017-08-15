
import React, { PropTypes, Component, Children } from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';

import Tab from './Tab';
import TabContent from './TabContent';
import styles from './styles.scss';

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
          contents.push(<TabContent children={item.props.children} />);
        }
      }
    });

    return {
      headers,
      contents,
    };
  }

  renderHeaders(headers) {
    return headers.map((item, idx) => {
      return React.cloneElement(item, {
        key: idx,
        index: idx,
        active: this.props.index === idx,
        onClick: (event, index) => {
          item.props.onClick && item.props.onClick(event);
          if (item.props.disabled) return;
          this.handleTabClick(index);
        },
        noUnderLine: this.props.noUnderLine,
      });
    });
  }

  renderContents(contents) {
    const contentElements = contents.map((item, idx) => {
      return React.cloneElement(item, {
        key: idx,
        active: this.props.index === idx,
        tabIndex: idx,
        noUnderLine: this.props.noUnderLine,
      });
    });

    return contentElements.filter((item, idx) => (idx === this.props.index));
  }

  render() {
    const {
      children,
      className,
      contentClass,
      navClass,
      noUnderLine,
    } = this.props;

    const newProps = omit(this.props, ['index', 'navClass', 'contentClass']);

    const classes = classNames(className, styles.tabs);
    const contentClasses = classNames(contentClass, styles.content);
    const { headers, contents } = this.parseChildren(children);

    return (
      // Order is important, classNames={classes} needs to override props.className
      <div {...newProps} className={classes}>
        <nav className={navClass}>
          {this.renderHeaders(headers)}
        </nav>
        <div className={contentClasses}>
          {this.renderContents(contents)}
        </div>
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
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Tabs;
export { Tab };
