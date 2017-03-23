
import React, { PropTypes, Component } from 'react';
import { Icon } from '../index';
import styles from './styles.scss';

export class IconBox extends Component {
  render () {
    const { icon, iconColor, background, iconAlign } = this.props.data;
    const iconClass = `fa fa-${icon}`;
    const style = {
      color: iconColor,
      background,
      justifyContent: iconAlign,
    };
    return (
      <div className={styles.bigComment}
           style={style}>
        <span className={iconClass} />
      </div>
    );
  }
}

export class BigCommentBubble extends Component {
  render () {
    const {
      icon,
      iconColor,
      background,
      iconAlign,
      headerLinkName,
      headerLinkSite,
      siteTitle,
      siteStars,
      sitePreview,
      createdAt
    } = this.props;

    return (
      <div  className={styles.bigCommentBubble}>
        <IconBox data={{ icon: icon, iconColor: iconColor, background: background, iconAlign: iconAlign}} />
        <div className={styles.bigCommentBubble__commentBody}>
          <div className={styles.bigCommentBubble__mainContent}>
            <div className={styles.bigCommentBubble__mainContent__header}>
              <span className={styles.bigCommentBubble__mainContent__header__link}>{headerLinkName}</span>
              reviewed your buisiness on
              <span className={styles.bigCommentBubble__mainContent__header__site}>{headerLinkSite}</span>
            </div>
            <div className={styles.bigCommentBubble__mainContent__rating}>
              {[...Array(siteStars)].map((x, i) =>
                <Icon key={i + 1} icon="star" />
              )}
            </div>
            <div className={styles.bigCommentBubble__mainContent__title}>
              {siteTitle}
            </div>
            <div className={styles.bigCommentBubble__mainContent__preview}>
              {sitePreview}
              <span className={styles.bigCommentBubble__mainContent__preview__toggleButton} >more... </span>
            </div>
            <div className={styles.bigCommentBubble__mainContent__requirements}>
              ACTION REQUIRED
            </div>
            <div className={styles.bigCommentBubble__mainContent__createdAt}>{createdAt}</div>
          </div>
          <div className={styles.bigCommentBubble__respondBlock}>
            <div className={styles.bigCommentBubble__respondBlock__respondButton}>
              Respond
            </div>
          </div>
        </div>
      </div>
    );
  }

}
