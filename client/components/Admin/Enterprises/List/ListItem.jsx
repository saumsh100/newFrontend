import React from 'react';
import { ListItem, VButton } from '../../../library/index';
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
        <VButton
          icon="pencil"
          rounded
          compact
          title="Edit"
          onClick={() => onEdit(id)}
        />
        <VButton
          icon="trash-o"
          negative
          rounded
          compact
          title="Delete"
          onClick={confirmDelete(() => onDelete(id))}
        />
      </div>
    ))}
  </ListItem>;

export default withHoverable(EnterprisesListItem);
