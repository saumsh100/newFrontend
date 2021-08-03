
export const theadStyles = {
  background: 'white',
  borderBottom: '1px solid #efefef',
  paddingTop: '20px',
  paddingBottom: '20px',
  position: 'sticky',
  top: 0,
  zIndex: 9999,
};

export const tbodyStyles = {
  overflow: 'unset', // override default behavior
};

export const colHeaderStyle = override => ({
  background: 'white',
  display: 'flex',
  justifyContent: 'center',
  boxShadow: 'none',
  alignItems: 'center',
  borderRight: 'none',
  color: '#686e74',
  outline: 'none',
  ...override,
});

export const trStyles = {
  alignItems: 'center',
  minHeight: '64px',
};
