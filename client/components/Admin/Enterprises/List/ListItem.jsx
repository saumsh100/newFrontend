import React from 'react';
import { ListItem, Button } from '../../../library/index';
import withHoverable from '../../../../hocs/withHoverable';
import styles from './styles.scss';

const confirmDelete = fn => () =>
  (confirm(`Are you sure want to delete "${name}"?`) ? fn() : null);

const renderIf = (cmp, render) => (cmp ? render() : null);

const EnterprisesListItem = ({ isHovered, name, id, onDelete, onEdit }) =>
  <ListItem className={styles.listItem}>
    <strong>{name}</strong>

    {renderIf(isHovered, () => (
      <div className={styles.listItemButtons}>
        <Button icon="pencil" default onClick={() => onEdit(id)}>Edit</Button>
        <Button icon="trash-o" onClick={confirmDelete(() => onDelete(id))}>
          Delete
        </Button>
      </div>
    ))}
  </ListItem>;

export default withHoverable(EnterprisesListItem);
