
import { JSONAPI } from '../../middleware/getResponseConfig';
import jsonapi from './jsonapi';
import normalize from '../_api/normalize';

export default function format(req, res, resourceName, dataArray) {
  if (req.responseConfig.type === JSONAPI) {
    return jsonapi(resourceName, dataArray);
  }

  return normalize(resourceName, dataArray);
};
