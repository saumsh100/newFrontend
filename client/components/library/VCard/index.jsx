
import React from 'react';
import PropTypes from 'prop-types';
import { isString } from 'lodash';
import { getClassMapper, omitTypes } from '../../Utils';
import styles from './vcard.scss';

const vcardScheme = ['noPadding'];

const vcardMapper = getClassMapper(vcardScheme, styles);

const VCard = (props) => {
  const omitVCardProps = (...args) => omitTypes(VCard, ...args);

  return (
    <props.as
      {...omitVCardProps(props)}
      className={vcardMapper.map(props, styles.vcard, props.className)}
    >
      {props.title ? (
        <props.headerAs>
          {isString(props.title) ? (
            <h1 className={styles['default-title']}>{props.title}</h1>
          ) : (
            props.title()
          )}
        </props.headerAs>
      ) : null}

      <props.bodyAs>{props.children}</props.bodyAs>
    </props.as>
  );
};

VCard.defaultProps = {
  as: 'section',
  bodyAs: 'article',
  headerAs: 'header',
};

const asType = PropTypes.oneOfType([PropTypes.string, PropTypes.func]);

VCard.propTypes = {
  ...vcardMapper.types(),
  children: PropTypes.node,
  as: asType,
  bodyAs: asType,
  headerAs: asType,
  className: PropTypes.string,
  title: PropTypes.node,
};

export default VCard;
