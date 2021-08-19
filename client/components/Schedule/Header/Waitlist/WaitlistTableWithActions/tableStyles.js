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

export const colHeaderStyle = (override) => ({
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
};

export const trGrpStyles = {
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  height: '64px',
};

export const pgStyles = {
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: '12px',
  paddingRight: '12px',
  boxShadow: 'none',
  height: '64px',
};
