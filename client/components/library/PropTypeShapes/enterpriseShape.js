import PropTypes from 'prop-types';

const enterpriseShape = {
  createdAt: PropTypes.string,
  deletedAt: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  plan: PropTypes.string,
  updatedAt: PropTypes.string,
  organization: PropTypes.string,
  csmAccountOwnerId: PropTypes.string,
};

export default enterpriseShape;
