
import React from 'react';
import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { ListItem } from '../../../../library';
import styles from './styles.scss';

const ChatListItemSkeleton = () => (
  <ListItem key="new" className={classNames(styles.chatListItem)}>
    <div className={styles.timesIcon} />
    <div className={styles.avatar}>
      <Skeleton circle height={35} width={35} />
    </div>
    <div className={styles.flexSection}>
      <div className={styles.topSection}>
        <div className={styles.fullName}>
          <div className={styles.nameAgeWrapper}>
            <div className={styles.name}>
              <Skeleton width={150} />
            </div>
            <div className={styles.preview}>
              <Skeleton width={45} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Skeleton width={175} />
      </div>
    </div>
  </ListItem>
);

export default ChatListItemSkeleton;
