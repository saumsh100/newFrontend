
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import Lorem from 'react-lorem-component';
import { SContainer, SHeader, SBody, SFooter } from './';
import styles from './stories.scss';

storiesOf('Layout', module)
  .addDecorator(withKnobs)
  .add('fixed header and footer', () => (
    <SContainer className={styles.wrapper}>
      <SHeader className={styles.header} />
      <SBody className={styles.body}>
        <Lorem count={10} />
      </SBody>
      <SFooter className={styles.footer} />
    </SContainer>
  ));
