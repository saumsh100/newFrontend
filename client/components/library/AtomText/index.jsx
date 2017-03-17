
import React, { PropTypes } from 'react';

const AtomTextBlock = function (props) {
  const { styles, children } = props; 
  const defaultStyles = {
  	display: 'flex',
  	flexDirection: 'column',
  	alignItems: 'center',
  	justifyContent: 'center',
  	width: 200,
  }

  const customStyle = Object.assign(defaultStyles, styles)
  return (
  	<div style={customStyle} > 
  		{children}
  	</div>
  );
}

const AtomText = function (props) {
	const { styles, children, icon } = props;
	const defaultStyles = { 
		margin: '10px 0px 10px 0px',
	}

	const customStyle = Object.assign(defaultStyles, styles);
	return (
		<span style={customStyle} className={ icon ? `fa fa-${icon}` : '' }>{children}</span>
	);
}

const AtomTextBlockWrapper = function (props) {
	const { children, styles } = props;
	const defaultStyles = { 
		flexDirection: 'row',
		display: 'flex',
		justifyContent: 'center',
	}

	const customStyle = Object.assign(defaultStyles, styles);

	return (
		<div style={customStyle} >
			{children}
		</div>
	)
}

export { AtomText, AtomTextBlock, AtomTextBlockWrapper };
