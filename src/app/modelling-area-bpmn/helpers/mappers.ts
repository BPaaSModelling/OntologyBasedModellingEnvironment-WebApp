export class Mappers {
  static dictionaryAOAMEBPMNElementToGoJsTaskType = new Map<string, number>()
    .set('Task', 0)
    .set('Task2', 1);

  static dictionaryAOAMEBPMNElementToGoJsCategory = new Map<string, string>()
    .set('Task', 'activity')
    .set('Task2', 'activity');
}
