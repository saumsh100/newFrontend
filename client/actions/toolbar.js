import { createAction } from 'redux-actions';

import { SET_IS_COLLAPSED, SET_IS_HOVERED } from '../constants';

export const setIsCollapsed = createAction(SET_IS_COLLAPSED);
export const setIsHovered = createAction(SET_IS_HOVERED);
