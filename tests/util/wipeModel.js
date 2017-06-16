
export default async function wipeModel(Model) {
  const models = await Model.run();
  for (const model of models) {
    await model.delete();
  }
}
