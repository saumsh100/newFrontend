import React from 'react';
import { ListItem, Button } from '../../library';
import withHoverable from '../../../hocs/withHoverable';
import styles from './styles.scss';

const renderIf = (cmp, render) => (cmp ? render() : null);
const EnterpriesListItem = ({ isHovered, name, id, onDelete }) =>
  <ListItem className={styles.listItem}>
    <strong>{name}</strong>

    {renderIf(isHovered, () => (
      <div className={styles.listItemButtons}>
        <Button icon="pencil" default>Edit</Button>
        <Button icon="trash-o" onClick={() => (confirm(`Are you sure to delete ${name}?`) ? onDelete(id) : null)}>Delete</Button>
      </div>
    ))}
  </ListItem>;

export default withHoverable(EnterpriesListItem);
