
import bcrypt from 'bcrypt';
import omit from 'lodash/omit';
import jwt from 'jsonwebtoken';
import globals from '../config/globals';
import { User, PatientUser, AuthSession } from '../_models';

export const error = (status, message) =>
  Promise.reject({
    status,
    message,
  });

const compare = (password, hash) => new Promise((fulfill, reject) => {
  bcrypt.compare(password, hash, (err, match) => {
    if (err) {
      return reject(err);
    }

    return fulfill(match);
  });
});

export const Auth = (Model, uniqueKey) => ({
  /**
   * @param {string} key
   */
  load(key) {
    // TODO: is this the most efficient
    return Model.findOne({ where: { [uniqueKey]: key } });
  },

  /**
   * @param {string} key
   * @param {string} password
   */
  login(key, password) {
    return this.load(key)
      .then(model => (model || error(401, 'Invalid Credentials')))
      .then(model =>
        compare(password, model.password)
          .then(match => (match ?
            model :
            error(401, 'Invalid Credentials')
          ))
          // TODO: remove AuthSession creation from here ?
          .then(() => AuthSession.create({ modelId: model.id }))
          .then(session => ({
            session,
            model,
          })));
  },

  /**
   * @param {object} model
   */
  signup(model) {
    model[uniqueKey] = model[uniqueKey].toLowerCase();
    model.password = bcrypt.hashSync(model.password, globals.passwordHashSaltRounds);

    return this.load(model[uniqueKey])
      .then(existedModel => (!existedModel) || error(400, 'Email Already in Use'))
      .then(() => Model.create(model))
      .then(model =>
        AuthSession.create({ modelId: model.id })
          .then(session => ({
            model,
            session,
          })));
  },

  /**
   * @param {string} token
   */
  logout(sessionId) {
    return AuthSession.findById(sessionId)
      .then((authSession) => {
        if (!authSession) throw { name: 'DocumentNotFoundError' };
        return authSession.destroy();
      })
      .catch(e => (
        e.name === 'DocumentNotFoundError' ?
          Promise.resolve(null) :
          Promise.reject(e)
      ));
  },

  /**
   * @param {object} tokenData
   */
  signToken(tokenData) {
    return new Promise((fulfill, reject) => {
      // TODO: This needs to be slowly phased out as we move towards session storage
      jwt.sign(tokenData, globals.tokenSecret, { expiresIn: globals.tokenExpiry }, (err, token) =>
        (err ? reject(err) : fulfill(token)));
    });
  },

  async updateSession(sessionId, session, updates) {
    // TODO: does this need to be a delete then save new?
    const oldSession = await AuthSession.findById(sessionId);
    if (!oldSession) throw new Error(`AuthSession with id=${sessionId} does not exist and so cannot be updated`);
    await oldSession.destroy();
    const prevSession = omit(oldSession.get({ plain: true }), ['id', 'createdAt', 'updatedAt', 'deletedAt']);
    return AuthSession.create({
      ...prevSession,
      ...updates,
      modelId: session.userId || session.modelId,
    });
  },
});

export const UserAuth = Auth(User, 'username');
export const PatientAuth = Auth(PatientUser, 'email');
