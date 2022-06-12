export class Mappers {
  static dictionaryAOAMEBPMNElementToGoJsTaskType = new Map<string, number>()
    .set('Task', 0)
    .set('ServiceTask', 6)
    .set('SubProcess', 0)
    .set('Activity', 0)
    .set('ScriptTask', 4)
    .set('ReceiveTask', 1)
    .set('ManualTask', 3)
    .set('SendTask', 5)
    .set('BusinessRuleTask', 7)
  ;

  static dictionaryAOAMEBPMNElementToGoJsCategory = new Map<string, string>()
    .set('Task', 'activity')
    .set('ServiceTask', 'activity')
    .set('SubProcess', 'activity')
    .set('Activity', 'activity')
    .set('ScriptTask', 'activity')
    .set('ReceiveTask', 'activity')
    .set('ManualTask', 'activity')
    .set('SendTask', 'activity')
    .set('BusinessRuleTask', 'activity');
}

//       { key: 131, category: 'activity', text: 'Task', item: 'generic task', taskType: 0 },
//       { key: 132, category: 'activity', text: 'User Task', item: 'User task', taskType: 2 },
//       // subprocess and start and end
//       { key: 134, category: 'subprocess', loc: '0 0', text: 'Subprocess', isGroup: true, isSubProcess: true, taskType: 0 },
//       { key: -802, category: 'event', loc: '0 0', group: 134, text: 'Start', eventType: 1, eventDimension: 1, item: 'start' },
//       { key: -803, category: 'event', loc: '350 0', group: 134, text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end' },
//{ key: 1, category: 'activity', taskType: 1, text: 'Receive Task', item: 'Receive Task' },
//       { key: 2, category: 'activity', taskType: 5, text: 'Send Task', item: 'Send Task' },
//       { key: 3, category: 'activity', taskType: 7, text: 'Business\nRule Task', item: 'Business Rule Task' },
//       { key: 4, category: 'activity', taskType: 2, text: 'User Task', item: 'User Task', isCall: true },
//       { key: 203, category: 'activity', taskType: 3, isAdHoc: true, text: 'Manual', item: 'Manual Task' },
//       { key: 204, category: 'activity', taskType: 4, isSequential: true, text: 'Script', item: 'Script Task' },
//       { key: 205, category: 'activity', taskType: 5, isParallel: true, text: 'Send Msg', item: 'Send Msg Task' },
//       { key: 206, category: 'activity', taskType: 6, isLoop: true, isSubProcess: true, isTransaction: true, text: 'Service', item: 'service task' },
