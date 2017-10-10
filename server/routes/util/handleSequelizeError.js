import format from './format';

export default function handleSequelizeError(error, normalize, res, req, next) {
  if (error.message.messages === 'AccountId PMS ID Violation') {
    const model = error.message.model.dataValues;
    const normalized = format(req, res, normalize, model);
    console.log(error);
    return res.status(201).send(normalized);
  }

  return next(error);
}
