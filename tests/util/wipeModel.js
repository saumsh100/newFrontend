
import * as Models from '../../server/models';

async function wipeModel(Model) {
  const models = await Model.run();
  for (const model of models) {
    await model.delete();
  }
}

async function wipeModelSequelize(Model) {
  await Model.destroy({
    where: {},
    force: true,
  });
}

async function wipeAllModels() {
  for (const modelName in Models) {
    await wipeModel(Models[modelName]);
  }
}

export default wipeModel;
export {
  wipeAllModels,
  wipeModelSequelize,
};
