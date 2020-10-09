
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './styles.scss';

const FooterSkeleton = () => <>
  <div className={styles.widthFull}>
    <Skeleton width={100} />
  </div>
  <div className={styles.widthFull}>
    <Skeleton width={40} />
  </div>
</>;

const PanelSkeleton = () => <>
  <div className={styles.widthFull}>
    <Skeleton width={75} />
  </div>
  <div className={styles.widthFull}>
    <Skeleton width={25} />
  </div>
</>;

const DesktopSkeleton = () => (
  <div className={styles.root}>
    <div className={styles.widthFull}>
      <Skeleton circle width={75} height={75} />
    </div>
    <div className={styles.name}>
      <Skeleton width={125} />
    </div>
    <div className={styles.row}>
      <div className={styles.innerRow}>
        <div className={styles.leftPlaceholder}>
          <PanelSkeleton />
        </div>
        <div className={styles.rightPlaceholder}>
          <PanelSkeleton />
        </div>
      </div>
    </div>
    <div className={styles.row}>
      <div className={styles.innerRow}>
        <div className={styles.leftPlaceholder}>
          <PanelSkeleton />
        </div>
        <div className={styles.rightPlaceholder}>
          <PanelSkeleton />
        </div>
      </div>
    </div>
    <div className={styles.firstFooter}>
      <FooterSkeleton />
    </div>
    <div className={styles.secondFooter}>
      <FooterSkeleton />
    </div>
  </div>
);

export default DesktopSkeleton;
