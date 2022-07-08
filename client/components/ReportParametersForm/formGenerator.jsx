import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from '../library';
import style from './style.scss';

export default function FormGenerator({ page, parameters, componentProps }) {
  const formComponents = parameters[page];

  /**
   * Generate components that take up the individual columns within the row.
   */
  const sameRowComponents = formComponents.parameters
    .filter(({ component }) => component !== 'selectPill')
    .map((formComponent) => {
      const Element = parameters.defaultComponents[formComponent.component];
      const elementProps = componentProps[formComponent.component];
      const hideElement = !!elementProps.hide;

      return (
        !hideElement && (
          <div key={formComponent.name}>
            <Element {...elementProps} />
          </div>
        )
      );
    });

  /**
   * Gerate components that take up the whole row.
   */
  const newRowComponents = formComponents.parameters
    .filter(({ component }) => component === 'selectPill')
    .map((formComponent) => {
      const Element = parameters.defaultComponents[formComponent.component];
      const elementProps = componentProps[formComponent.component];

      return (
        <Row end="xs" key={formComponent.name}>
          <Col>
            <Element {...elementProps} />
          </Col>
        </Row>
      );
    });

  return (
    <Card className={style.mainRowWrapper}>
      {sameRowComponents}
      {newRowComponents}
    </Card>
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
      checked: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
