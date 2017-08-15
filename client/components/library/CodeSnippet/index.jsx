
import React, { Component, PropTypes} from 'react';
import styles from './styles.scss';
import classNames from 'classnames';
import IconButton from '../IconButton';

class CodeSnippet extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      codeSnippet,
      hideClipBoard,
      className,
    } = this.props;

    const classes = classNames(
      className
    );

    let showClipBoard = !hideClipBoard ? (
      <IconButton
        icon="clipboard"
        onClick={()=> {
          const emailLink = document.querySelector('#js-emaillink');
          const range = document.createRange();
          range.selectNode(emailLink);
          window.getSelection().addRange(range);

          try {
            // Now that we've selected the anchor text, execute the copy command
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copy command was ' + msg);
          } catch(err) {
            console.log('Oops, unable to copy');
          }

          // Remove the selections - NOTE: Should use
          // removeRange(range) when it is supported
          window.getSelection().removeAllRanges();
        }}
      />
    ) : null;
    return (
      <div className={classes} style={{display: 'flex'}}>
        <div className={styles.codeSnippet}>
          <span id="js-emaillink" className={styles.codeSnippet_code}>{codeSnippet}</span>
        </div>
        {showClipBoard}
      </div>
    );
  }
}

CodeSnippet.propTypes = {
  codeSnippet: PropTypes.string,
};

export default CodeSnippet;
