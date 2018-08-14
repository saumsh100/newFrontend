
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { Icon } from '../index';
import DoubleIcon from '../DoubleIcon';
import styles from './styles.scss';

export class IconBox extends Component {
  render() {
    const {
      icon, iconColor, background, iconAlign,
    } = this.props.data;
    const iconClass = `fa fa-${icon}`;
    const style = {
      color: iconColor,
      background,
      justifyContent: iconAlign,
    };
    return (
      <div className={styles.bigComment} style={style}>
        <img src={icon} width="41px" height="38px" />
      </div>
    );
  }
}

export class Comment extends Component {
  render() {
    const {
      imageSrc, userName, message, sentAt,
    } = this.props;
    return (
      <div className={styles.bigCommentBubble__comments}>
        <div className={styles.comment}>
          <div className={styles.comment__avatar}>
            <img src={imageSrc} />
          </div>
          <div className={styles.comment__message}>
            <span className={styles.comment__message__username}>
              {userName}
            </span>
            <span className={styles.comment__message__text}>{message}</span>
            <span className={styles.comment__message__sentAt}>
              {moment().format('MMMM Do YYYY, h:mm:ss a')}
            </span>
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
      sourceName,
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
      url,
      reviewerUrl,
      onClickHowTo,
    } = this.props;

    const sentiment = siteStars >= 4 ? 'Positive' : 'Negative';

    return (
      <div className={styles.bigCommentBubble}>
        {doubleIcon && <DoubleIcon {...doubleIcon} />}
        {icon && <IconBox data={{
 icon, iconColor, background, iconAlign,
}}
        />}
        <div className={styles.bigCommentBubble__commentBody}>
          <div className={styles.bigCommentBubble__mainContent}>
            <div className={styles.bigCommentBubble__mainContent__header}>
              <a
                href={reviewerUrl}
                className={styles.bigCommentBubble__mainContent__header__link}
              >
                {headerLinkName}
              </a>
              reviewed your practice on
              <a
                href={`http://www.${headerLinkSite}`}
                target="_blank"
                className={styles.bigCommentBubble__mainContent__header__site}
              >
                {headerLinkSite}
              </a>
            </div>
            <div className={styles.bigCommentBubble__mainContent__rating}>
              {siteStars > 0 &&
                [...Array(siteStars)].map((x, i) => (
                  <Icon key={i + 1} size={1.8} icon="star" type="solid" />
                ))}
            </div>
            <div className={styles.bigCommentBubble__mainContent__preview}>
              {sitePreview}
              {/* TODO: put this there ONLY if length is greater */}
              {sitePreview && !(sitePreview.length < 333) && url ? (
                <a
                  href={url}
                  target="_blank"
                  className={
                    styles.bigCommentBubble__mainContent__preview__toggleButton
                  }
                >
                  more...
                </a>
              ) : null}
            </div>
            {requiredAction && (
              <div
                className={styles.bigCommentBubble__mainContent__requirements}
              >
                {requiredAction}
              </div>
            )}
            <div className={styles.bigCommentBubble__mainContent__createdAt}>
              {moment(createdAt).fromNow(true)} ago
            </div>
            <div className={styles.bigCommentBubble__attachments}>
              {attachments.map((at, i) => <img key={i} src={at.src} />)}
            </div>
            {comments.map((c, i) => <Comment key={i} {...c} />)}
          </div>
          <div className={styles.howToWrapper}>
            <div
              className={styles.howToLink}
              onClick={() => onClickHowTo(sentiment.toLowerCase())}
            >
              How to Respond to {sentiment} Reviews
            </div>
          </div>
          <div className={styles.bigCommentBubble__respondBlock}>
            {actions && (
              <div className={styles.bigCommentBubble__respondBlock__actions}>
                <span className="fa fa-ban" />
                <span className="fa fa-trash" />
              </div>
            )}
            <a
              href={url}
              target="_blank"
              className={styles.bigCommentBubble__respondBlock__respondButton}
            >
              {url ? 'Respond' : ' '}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

BigCommentBubble.propTypes = {
  onClickHowTo: PropTypes.func.isRequired,
};
