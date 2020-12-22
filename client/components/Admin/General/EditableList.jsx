
import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, VButton, Row, Col } from '../../library';
import styles from './editable-list.scss';

const EditableListItem = ({ children, item, onDelete, onEdit }) => (
  <ListItem className={styles.item}>
    <Row middle="md" className={styles.row}>
      <Col md={8}>{children}</Col>
      <Col md={4}>
        <div className={styles.buttons}>
          <VButton
            icon="pencil"
            rounded
            compact
            onClickCapture={(e) => {
              e.preventDefault();
              onEdit(item);
            }}
          />
          <VButton
            icon="trash"
            negative
            rounded
            compact
            onClickCapture={(e) => {
              e.preventDefault();
              onDelete(item);
            }}
          />
        </div>
      </Col>
    </Row>
  </ListItem>
);

EditableListItem.propTypes = {
  children: PropTypes.node.isRequired,
  item: PropTypes.shape({}).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

const EditableList = ({ items, onEdit, onDelete, render, confirm }) => {
  const confirmAndDelete = (item) => {
    const confirmMessage = typeof confirm === 'function' ? confirm(item) : confirm;

    if (confirmMessage && window.confirm(confirmMessage)) {
      onDelete(item);
    }
  };

  const renderItem = item => (
    <EditableListItem key={item.id} item={item} onEdit={onEdit} onDelete={confirmAndDelete}>
      {render(item)}
    </EditableListItem>
  );

  return items && items.length ? <List>{items.map(renderItem)}</List> : <div>No items.</div>;
};

EditableList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  confirm: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
};

EditableList.defaultProps = {
  items: null,
};

export default EditableList;
