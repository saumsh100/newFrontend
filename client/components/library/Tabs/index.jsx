
import React, { PropTypes, Component, Children } from 'react';
import Tab from './Tab';
import omit from 'lodash/omit';
import TabContent from './TabContent';
import classNames from 'classnames';
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
      });
    });
  }

  renderContents(contents) {
    const contentElements = contents.map((item, idx) => {
      return React.cloneElement(item, {
        key: idx,
        active: this.props.index === idx,
        tabIndex: idx,
      });
    });

    return contentElements.filter((item, idx) => (idx === this.props.index));
  }

  render() {
    const {
      children,
      className,
      navClass,
    } = this.props;

    const newProps = omit(this.props,['index']);

    const classes = classNames(className, styles.tabs);
    const { headers, contents } = this.parseChildren(children);

    return (
      // Order is important, classNames={classes} needs to override props.className
      <div {...newProps} className={classes}>
        <nav className={navClass}>
          {this.renderHeaders(headers)}
        </nav>
        <div className={styles.content}>
          {this.renderContents(contents)}
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Tabs;
export { Tab };
