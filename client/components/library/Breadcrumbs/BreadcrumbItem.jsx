
import React from 'react';
import PropTypes from 'prop-types';
import styles from './breadcrumbItem.scss';
import { withRouter } from 'react-router-dom';
import { getClassMapper, omitTypes } from '../../Utils';

const mapper = getClassMapper(['home'], styles);

const omitProps = props => omitTypes(BreadcrumbItem, props);

const renderContent = (props) => {
  const { icon, children, title } = props;
  const elProps = omitProps(props);

  const renderText = () => children || <span {...elProps}>{title}</span>;

  const hasText = children || title;

  return (
    <span>
      {icon ? <i className={`fa fa-${icon} ${styles.icon}`} /> : null}
      {hasText ? renderText() : null}
    </span>
  );
};

const BreadcrumbItem = props => (
  <props.as
    className={mapper.map(props, styles.base)}
    onClick={() => (props.link ? props.history.push(props.link) : null)}
  >
    {renderContent(props)}

    <span className={styles.corner} />
    <span className={styles['corner-border']} />
  </props.as>
);

BreadcrumbItem.defaultProps = {
  as: 'li',
};

BreadcrumbItem.propTypes = {
  ...mapper.types(),

  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  children: PropTypes.node,

  link: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,

  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(BreadcrumbItem);
