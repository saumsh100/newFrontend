
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Grid, Col } from '../library';
import style from './style.scss';

export default function FormGenerator({ page, parameters, componentProps }) {
  const formComponents = parameters[page];

  /**
   * Generate components that take up the individual columns within the row.
   */
  const sameRowComponents = formComponents.fields
    .filter(component => component.size !== 'row')
    .map((formComponent) => {
      const Element = parameters.defaultComponents[formComponent.component];
      const elementProps = componentProps[formComponent.name];

      return (
        <Col
          md={formComponent.size}
          smOffset={formComponent.offset}
          key={formComponent.name}
          className={style.col}
        >
          <Element {...elementProps} />
        </Col>
      );
    });

  /**
   * Gerate components that take up the whole row.
   */
  const newRowComponents = formComponents.fields
    .filter(component => component.size === 'row')
    .map((formComponent) => {
      const Element = parameters.defaultComponents[formComponent.component];
      const elementProps = componentProps[formComponent.name];

      return (
        <Row end="xs" key={formComponent.name} className={style.row}>
          <Col>
            <Element {...elementProps} />
          </Col>
        </Row>
      );
    });

  return (
    <Grid className={style.gridWrapper}>
      <Row className={style.mainRowWrapper}>{sameRowComponents}</Row>
      {newRowComponents}
    </Grid>
  );
}

FormGenerator.propTypes = {
  page: PropTypes.string.isRequired,
  parameters: PropTypes.shape({ defaultComponents: PropTypes.shape() }).isRequired,
  componentProps: PropTypes.shape({
    dateRange: PropTypes.shape({
      popover: PropTypes.bool,
      from: PropTypes.string,
      to: PropTypes.string,
      onChange: PropTypes.func,
    }),
    categories: PropTypes.shape({
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
      selected: PropTypes.string,
      label: PropTypes.string,
      onChange: PropTypes.func,
    }),
    showComparisons: PropTypes.shape({
      label: PropTypes.string,
      checked: PropTypes.string,
      onChange: PropTypes.func,
    }),
    dateRangeFilter: PropTypes.shape({
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
      selected: PropTypes.string,
      onChange: PropTypes.func,
    }),
    submit: PropTypes.shape({
      label: PropTypes.string,
      disabled: PropTypes.bool,
      onClick: PropTypes.func,
    }),
  }),
};

FormGenerator.defaultProps = { componentProps: {} };
