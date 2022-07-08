
const ColorPurple = '#968AB7';
const ColorGrey = '#78708D';
const LargeWeight = '700';
const ExtraSmallSize = '10px';
const MediumWeight = '500';
const MediumSize = '14px';
const ColorLavender = '#ECEBFF';

export const theadStyles = {
  background: 'white',
  borderBottom: `1px solid ${ColorLavender}`,
  color: ColorGrey,
  fontWeight: MediumWeight,
  fontSize: MediumSize,
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
  fontWeight: LargeWeight,
  color: ColorPurple,
  fontSize: ExtraSmallSize,
  outline: 'none',
  ...override,
});

export const trStyles = {
  alignItems: 'center',
};

export const trGrpStyles = {
  borderBottom: `1px solid ${ColorLavender}`,
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
