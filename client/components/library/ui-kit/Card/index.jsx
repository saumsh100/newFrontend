
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DonnaLoading from '../DonnaLoading';
import styles from './styles.scss';

const Card = ({
  children,
  className,
  noBorder,
  runAnimation,
  loaded,
  contentStyle,
  message,
  accountName,
  ...props
}) => {
  const isLoading = runAnimation && !loaded;
  const withoutBorder = () => noBorder || isLoading;

  const classes = classNames(styles.card, className, {
    [styles.noBorder]: withoutBorder(),
    [styles.loadedCard]: loaded,
  });
  const childrenWrapper = classNames({ [styles.isLoadingContent]: isLoading });

  const innerCardStyle = classNames(styles.contentStyle, contentStyle);

  return (
    <div {...props} className={classes}>
      <DonnaLoading isLoading={isLoading} accountName={accountName} message={message} />
      <div className={innerCardStyle}>
        <div className={childrenWrapper}>{children}</div>
      </div>
    </div>
  );
};

Card.propTypes = {
  noBorder: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  runAnimation: PropTypes.bool,
  loaded: PropTypes.oneOfType([PropTypes.bool, PropTypes.objectOf(PropTypes.any)]),
  contentStyle: PropTypes.string,
  message: PropTypes.string,
  accountName: PropTypes.string,
};

Card.defaultProps = {
  noBorder: false,
  className: '',
  runAnimation: false,
  loaded: false,
  children: null,
  contentStyle: null,
  message: null,
  accountName: null,
};

export default Card;
