
import React, { PropTypes } from 'react';
import { Card, Link } from '../library';
import styles from './styles.scss';

export default function FourZeroFour({ location: { pathname } }) {
  return (
    <Card className={styles.cardContainer404}>
      <h1 className={styles.headerOne}>404</h1>
      <h3>This isn’t the thing you’re looking for.</h3>
      <div>
        We can’t find <strong> {pathname} </strong>. Please use the navigation
        or
        <Link to="/"> click here</Link> to go home.
      </div>
    </Card>
  );
}

FourZeroFour.propTypes = {
  location: PropTypes.any.required,
};
