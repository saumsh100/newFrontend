import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import styles from './styles.scss';
import { Card, CodeSnippet, Header } from '../library';

function Typography(props) {
  const { push } = props;

  return (
    <Card className={styles.mainContainer}>
      <div className={styles.padding}>
        <span className={styles.fontMedium}>.fontMedium</span>
        <CodeSnippet
          codeSnippet="{font-family: Inter, sans serif; font-size: 14px; font-weight: 500;}"
          hideClipBoard
        />
      </div>

      <div className={styles.padding}>
        <span className={styles.fontJumbo}>.fontJumbo</span>
        <CodeSnippet
          codeSnippet="{font-family: Inter, sans serif; font-size: 73px; font-weight: 600; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/intelligence')}>
          <span>- dashboard-stats, intelligence-stats, or business-stats.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.cardHeaderCount}>.cardHeaderCount</span>
        <CodeSnippet
          codeSnippet="{font-size: 25px; font-weight: 600; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/')}>
          <span>- the displayed number on dashboard-appointment-requests.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.cardHeaderTitle}>.cardHeaderTitle</span>
        <CodeSnippet
          codeSnippet="{font-family: Inter, sans serif; font-size: 16px; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/')}>
          <span>- the displayed title on dashboard-appointment-requests.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.header}>.header</span>
        <CodeSnippet
          codeSnippet="{font-size: 25px; font-weight: 600; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/settings')}>
          <span>- all settings page headers eg. General.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.listItemHeader}>.listItemHeader</span>
        <CodeSnippet
          codeSnippet="{font-family: Inter, sans serif; color: #2e3845; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/settings/practitioners')}>
          <span>
            - patient name on dashboard-sentReminders-list or practitioner name on
            settings-practitioners-list .
          </span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.subHeader}>.subHeader</span>
        <CodeSnippet
          codeSnippet="{color: darken(lightgrey, 5%); letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/')}>
          <span>- service name on dashboard-appointment-list .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.subHeaderSmall}>.subHeaderSmall</span>
        <CodeSnippet
          codeSnippet="{color: #959596; font-size: 12px; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/patients/messages')}>
          <span>- text message on patients-messages-list, below the name .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.subHeaderExtraSmall}>.subHeaderExtraSmall</span>
        <CodeSnippet
          codeSnippet="{color: #959596; font-size: 10px; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/patients/list')}>
          <span>- last appointment text on large patient-info display .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.subHeaderMedium}>.subHeaderMedium</span>
        <CodeSnippet
          codeSnippet="{color: darken(lightgrey, 5%); font-size: 12px; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/patients/list')}>
          <span>- phone number and email on large patient-info display .</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.subHeaderMediumSmall}>.subHeaderMediumSmall</span>
        <CodeSnippet
          codeSnippet="{font-family: Inter, sans serif; font-size: 12px; color: #959596; letter-spacing: 0.5px;}"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/patients/list')}>
          <span>- next appt text on patients-list, below name.</span>
        </div>
      </div>

      <div className={styles.padding}>
        <span className={styles.tab}>.tab</span>
        <CodeSnippet
          codeSnippet="{ font-family: Inter, sans serif; color: #959596; }"
          hideClipBoard
        />
        <div className={styles.examples} onClick={() => push('/settings/practitioners')}>
          <span>- settings sub-pages and setting-practitioners.</span>
        </div>
      </div>

      <div className={styles.legend}>
        <div>
          {' '}
          <b>TYPOGRAPHY</b>
        </div>
        <br />
        <span>
          <b>How to Use These Fonts</b>
        </span>
        <br /> <br />
        <div>
          <span>
            <b>Option 1</b>
          </span>
          <br />
          <div>- Import the font.scss file.</div>
          <br />
          <div>- Extend the font class into your local style sheet (eg: @extend .jumboFont).</div>
        </div>
        <br />
        <div>
          <span>
            <b>Option 2</b>
          </span>
          <br />
          <div>- No import required</div>
          <br />
          <div>
            - In your local style sheet use composes function. (eg: composes: jumboFont from
            "sass-loader!../../font.scss")
          </div>
        </div>
      </div>
    </Card>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      push,
    },
    dispatch,
  );
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(Typography);
