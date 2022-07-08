import React from 'react';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../Widget/components/Button';
import styles from './styles.scss';

function WidgetCard(props) {
  const finalProps = omit(props, ['description', 'centered', 'arrow', 'selected']);
  const buttonClasses = classNames(styles.card, {
    [styles.selectedCard]: props.selected,
    [styles.centered]: props.centered,
  });

  const titleDescription = (
    <div>
      <h3 className={styles.title}>{props.title}</h3>
      {props.description && <span className={styles.description}>{props.description}</span>}
    </div>
  );

  return (
    <Button {...finalProps} className={buttonClasses}>
      <div className={styles.cardWrapper}>
        {props.imageComponent ? props.imageComponent(titleDescription) : titleDescription}
      </div>
      {props.arrow && (
        <span className={styles.cardArrow}>
          <svg width="6" height="10" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 8.575l3.709-3.717L0 1.142 1.142 0 6 4.858 1.142 9.717z" />
          </svg>
        </span>
      )}
    </Button>
  );
}

export default WidgetCard;

WidgetCard.propTypes = {
  description: PropTypes.string,
  selected: PropTypes.bool,
  arrow: PropTypes.bool,
  centered: PropTypes.bool,
  title: PropTypes.string.isRequired,
  imageComponent: PropTypes.node,
};

WidgetCard.defaultProps = {
  description: '',
  arrow: false,
  centered: false,
  selected: false,
  imageComponent: null,
};
