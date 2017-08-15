import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import classNames from 'classnames'
import { Card, CodeSnippet } from '../library';
export default function Typography(props) {
  console.log(classNames(styles.padding))

  return (
    <Card className={styles.mainContainer}>
      <div className={styles.padding}>
        Default font: abcdefg 12345 ABCDEFG
        <CodeSnippet
          codeSnippet={'{font-family: Gotham-Book; font-size: 14px; font-weight: 500;}'}
          hideClipBoard

        />
      </div>
      <div className={styles.padding}>
        <span className={styles.mediumFont}> Medium font: abcdefg 12345 ABCDEFG </span>
        <div>
          <CodeSnippet
            className={styles.padding}
            codeSnippet={'{font-family: Gotham Medium; font-size: 14px; font-weight: 500;}'}
            hideClipBoard
          />
        </div>
      </div>
      <div className={styles.padding}>
        <span className={styles.jumboFont}> Jumbo font: abcdefg 12345 ABCDEFG  </span>
        <CodeSnippet
          className={styles.padding}
          codeSnippet={'{font-family: Gotham Medium; font-size: 73px; font-weight: 600; letter-spacing: 2px;}'}
          hideClipBoard

        />
      </div>
      <div className={styles.padding}>
        <span className={styles.header}> Header : abcdefg 12345 ABCDEFG - Settings Page </span>
        <CodeSnippet
          className={styles.padding}
          codeSnippet={'{font-size: 25px; font-weight: 600; letterSpacing: 2px;}'}
          hideClipBoard
        />
      </div>
      <div className={styles.padding}>
        <span className={styles.cardHeaderCount}> CardHeader Count: 12345 - Dashboard Cards </span>
        <CodeSnippet
          className={styles.padding}
          codeSnippet={'{font-size: 25px; font-weight: 600; letterSpacing: 2px;}'}
          hideClipBoard
        />
        <div>
          <span className={styles.cardHeaderTitle}> CardHeader Title: abcdefg 12345 ABCDEFG - Dashboard Cards </span>
        </div>
        <CodeSnippet
          className={styles.padding}
          codeSnippet={'{font-family: Gotham Medium; font-size: 16px; letterSpacing: 2px;}'}
          hideClipBoard
        />
      </div>
      <div className={styles.padding}>
        <span className={styles.listItemHeader}> List Header: abcdefg 12345 ABCDEFG - Appointments List  </span>
        <CodeSnippet
          className={styles.padding}
          codeSnippet={'{font-family: Gotham Medium; color: #2e3845; letterSpacing: 2px;}'}
          hideClipBoard
        />
      </div>
      <div className={styles.padding}>
        <span className={styles.subHeader}> Sub Header: abcdefg 12345 ABCDEFG - Patientlist on Patient Management  </span>
        <CodeSnippet
          className={styles.padding}
          codeSnippet={'{color: darken(lightgrey, 5%); letterSpacing: 2px;}'}
          hideClipBoard
        />
        <div>
          <span className={styles.subHeaderMedium}> Sub Header Medium: abcdefg 12345 ABCDEFG - Patientlist on Patient Management  </span>
          <CodeSnippet
            className={styles.padding}
            codeSnippet={'{color: darken(lightgrey, 5%); font-size: 12px letterSpacing: 2px;}'}
            hideClipBoard
          />
        </div>
      </div>
      <div className={styles.padding}>
        <span className={styles.tab}> Tabs: abcdefg 12345 ABCDEFG - Settings Practitioner  </span>
        <CodeSnippet
          className={styles.padding}
          codeSnippet={'{ font-family: Gotham Medium; color: #959596; }'}
          hideClipBoard
        />
      </div>
    </Card>
  );
}
