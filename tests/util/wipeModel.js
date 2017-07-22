
import * as Models from '../../server/models';

export default async function wipeModel(Model) {
  const models = await Model.run();
  for (const model of models) {
    await model.delete();
  }
}

export async function wipeAllModels() {
  for (const modelName in Models) {
    await wipeModel(Models[modelName]);
  }
}
