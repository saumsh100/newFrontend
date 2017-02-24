import {
  setPopOverId,
} from '../actions/requests';

export function setPopoverId(id){
  return function(dispatch){
    dispatch(setPopOverId(id));
  }
}