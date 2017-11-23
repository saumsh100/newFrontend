
import React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

export default function ClassyDiv(_className) {
  return function (props) {
    const { className } = props;
    const classes = classNames(className, _className);
    const newProps = omit(props, ['className']);
    return <div className={classes} {...newProps} />;
  };
}
