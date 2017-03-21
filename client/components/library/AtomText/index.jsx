
import React, { PropTypes } from 'react';

const AtomText = function (props) {
	const { styles, children, icon } = props;
	const defaultStyles = { 
		
	}

	const customStyle = Object.assign(defaultStyles, styles);
	return (
		<span style={customStyle} className={ icon ? `fa fa-${icon}` : '' }>{children}</span>
	);
}

export { AtomText };
