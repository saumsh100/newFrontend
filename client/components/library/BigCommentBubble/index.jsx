
import React, { PropTypes, Component } from 'react';
import { Icon } from '../index';
import styles from './styles.scss';

import DoubleIcon from '../DoubleIcon';

export class IconBox extends Component {
  render() {
    const { icon, iconColor, background, iconAlign } = this.props.data;
    const iconClass = `fa fa-${icon}`;
    const style = {
      color: iconColor,
      background,
      justifyContent: iconAlign,
    };
    return (
      <div
        className={styles.bigComment}
        style={style}
      >
        <span className={iconClass} />
      </div>
    );
  }
}

export class Comment extends Component {
  render() {
    const { imageSrc, userName, message, sentAt } = this.props;
    return (
      <div className={styles.bigCommentBubble__comments}>
        <div className={styles.comment}>
          <div className={styles.comment__avatar}>
            <img src={imageSrc} />
          </div>
          <div className={styles.comment__message}>
            <span className={styles.comment__message__username}>{userName}</span>
            <span className={styles.comment__message__text}>{message}</span>
            <span className={styles.comment__message__sentAt}>{moment().format('MMMM Do YYYY, h:mm:ss a')}</span>
          </div>
        </div>
      </div>
    );
  }
}


export class BigCommentBubble extends Component {
  render() {
    const {
      icon,
      doubleIcon,
      iconColor,
      background,
      iconAlign,
      headerLinkName,
      headerLinkSite,
      siteTitle,
      siteStars,
      sitePreview,
      createdAt,
      comments = [],
      attachments = [],
      actions,
      requiredAction,
    } = this.props;
    return (
      <div className={styles.bigCommentBubble}>
        {doubleIcon && <DoubleIcon {...doubleIcon} /> }
        {icon && <IconBox data={{ icon, iconColor, background, iconAlign }} /> }
        <div className={styles.bigCommentBubble__commentBody}>
          <div className={styles.bigCommentBubble__mainContent}>
            <div className={styles.bigCommentBubble__mainContent__header}>
              <span className={styles.bigCommentBubble__mainContent__header__link}>{headerLinkName}</span>
              reviewed your buisiness on
              <span className={styles.bigCommentBubble__mainContent__header__site}>{headerLinkSite}</span>
            </div>
            <div className={styles.bigCommentBubble__mainContent__rating}>
              {siteStars > 0 && [...Array(siteStars)].map((x, i) =>
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
            {requiredAction &&
              <div className={styles.bigCommentBubble__mainContent__requirements}>
                {requiredAction}
              </div>
            }
            <div className={styles.bigCommentBubble__mainContent__createdAt}>{createdAt}</div>
            <div className={styles.bigCommentBubble__attachments}>
              {attachments.map(at => (<img src={at.src} />))}
            </div>
            {comments.map(c => (<Comment {...c} />))}
          </div>
          <div className={styles.bigCommentBubble__respondBlock}>
            {actions &&
              <div className={styles.bigCommentBubble__respondBlock__actions} >
                <span className="fa fa-ban" />
                <span className="fa fa-trash" />
              </div>
            }
            <div className={styles.bigCommentBubble__respondBlock__respondButton}>
              Respond
            </div>
          </div>
        </div>
      </div>
    );
  }

}
