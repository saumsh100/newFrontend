
import * as Models from '../../server/_models';

async function wipeModel(Model) {
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
};
