import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles.scss';
import classNames from 'classnames';
import { push } from 'react-router-redux';
import { Card, CodeSnippet, Header } from '../library';

function Typography(props) {
  const {
    push
  } = props;

  return (
    <Card className={styles.mainContainer}>
      <div className={styles.padding}>
        <span
          className={styles.fontMedium}
        >
          .fontMedium
        </span>
        <CodeSnippet
          codeSnippet={'{font-family: Gotham Medium; font-size: 14px; font-weight: 500;}'}
          hideClipBoard
        />
      </div>

      <div className={styles.padding}>
        <span
          className={styles.fontJumbo}
        >
          .fontJumbo
        </span>
        <CodeSnippet
          codeSnippet={'{font-family: Gotham Medium; font-size: 73px; font-weight: 600; letter-spacing: 0.5px;}'}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- dashboard-stats, intelligence-stats, or business-stats.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.cardHeaderCount}
        >
          .cardHeaderCount
        </span>
        <CodeSnippet
          codeSnippet={'{font-size: 25px; font-weight: 600; letterSpacing: 0.5px;}'}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- the displayed number on dashboard-appointment-requests.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.cardHeaderTitle}
        >
          .cardHeaderTitle
        </span>
        <CodeSnippet
          codeSnippet={'{font-family: Gotham Medium; font-size: 16px; letterSpacing: 0.5px;}'}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- the displayed title on dashboard-appointment-requests.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.header}
        >
          .header
        </span>
        <CodeSnippet
          codeSnippet={'{font-size: 25px; font-weight: 600; letterSpacing: 0.5px;}'}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- all settings page headers eg. General.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.listItemHeader}
        >
          .listItemHeader
        </span>
        <CodeSnippet
          codeSnippet={'{font-family: Gotham Medium; color: #2e3845; letterSpacing: 0.5px;}'}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- patient name on dashboard-sentReminders-list or practitioner name on settings-practitioners-list .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.subHeader}
        >
          .subHeader
        </span>
        <CodeSnippet
          codeSnippet={'{color: darken(lightgrey, 5%); letterSpacing: 0.5px;}'}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- service name on dashboard-appointment-list .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.subHeaderSmall}
        >
          .subHeaderSmall
        </span>
        <CodeSnippet
          codeSnippet={`{color: $primary-darkgrey; font-size: $small-size; @extend .letterSpacing;}`}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- text message on patients-messages-list, below the name .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.subHeaderExtraSmall}
        >
          .subHeaderExtraSmall
        </span>
        <CodeSnippet
          codeSnippet={`{color: $primary-darkgrey;font-size: $extra-small-size;@extend .letterSpacing;}`}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- last appointment text on large patient-info display .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.subHeaderMedium}
        >
          .subHeaderMedium
        </span>
        <CodeSnippet
          codeSnippet={'{color: darken(lightgrey, 5%); font-size: 12px letterSpacing: 0.5px;}'}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- phone number and email on large patient-info display .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.subHeaderMediumSmall}
        >
          .subHeaderMediumSmall
        </span>
        <CodeSnippet
          codeSnippet={`{font-family: $medium-font;font-size: $small-size;color: $primary-darkgrey;@extend .letterSpacing;}`}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- next appt text on patients-list, below name.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span
          className={styles.tab}
        >
          .tab
        </span>
        <CodeSnippet
          codeSnippet={'{ font-family: Gotham Medium; color: #959596; }'}
          hideClipBoard
        />
        <div className={styles.examples} >
          <span>- settings sub-pages and setting-practitioners.</span>
        </div>
      </div>

      <div className={styles.legend}>
        <div> <b>TYPOGRAPHY</b></div><br/>
        <span><b>How to Use These Fonts</b></span><br /> <br />
        <div>
          <span><b>Option 1</b></span><br />
          <div>- Import the font.scss file.</div><br />
          <div>- Extend the font class into your local style sheet (eg: @extend .jumboFont).</div>
        </div><br />
        <div>
          <span><b>Option 2</b></span><br />
          <div>- No import required</div><br />
          <div>- In your local style sheet use composes function. (eg: composes: jumboFont from "sass-loader!../../font.scss")</div>
        </div>
      </div>
    </Card>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    push,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(Typography);
