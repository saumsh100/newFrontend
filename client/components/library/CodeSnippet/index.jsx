import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import IconButton from '../IconButton';

const CodeSnippet = ({ codeSnippet, hideClipBoard, className }) => {
  const classes = classNames(className);
  const showClipBoard = !hideClipBoard ? (
    <IconButton
      icon="clipboard"
      onClick={() => {
        const emailLink = document.querySelector('#js-emaillink');
        const range = document.createRange();
        range.selectNode(emailLink);
        window.getSelection().addRange(range);

        try {
          // Now that we've selected the anchor text, execute the copy command
          const successful = document.execCommand('copy');
          const msg = successful ? 'successful' : 'unsuccessful';
          console.log(`Copy command was ${msg}`);
        } catch (err) {
          console.error('Oops, unable to copy');
        }

        // Remove the selections - NOTE: Should use
        // removeRange(range) when it is supported
        window.getSelection().removeAllRanges();
      }}
    />
  ) : null;
  return (
    <div className={classes} style={{ display: 'flex' }}>
      <div className={styles.codeSnippet}>
        <span id="js-emaillink" className={styles.codeSnippet_code}>
          {codeSnippet}
        </span>
      </div>
      <div className={styles.iconContainer}>{showClipBoard}</div>
    </div>
  );
};

CodeSnippet.propTypes = {
  codeSnippet: PropTypes.string.isRequired,
  hideClipBoard: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

CodeSnippet.defaultProps = {
  hideClipBoard: false,
  className: null,
};

export default CodeSnippet;
