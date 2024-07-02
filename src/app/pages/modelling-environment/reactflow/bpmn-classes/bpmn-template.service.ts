import {Inject, Injectable} from '@angular/core';
// @ts-ignore
import {Mappers} from '../mappers';
import {ModelElementDetail} from '../../../../shared/models/ModelElementDetail.model';
///import {AdditionalCreateOptions} from '../../models/additional-create-options.interface';
import {BpmnConstantsClass} from './bpmn-constants.class';
import {PaletteElementModel} from '../../../../shared/models/PaletteElement.model';


class AdditionalCreateOptions {
  size: any;
  group: any;
  loc: any;
}

@Injectable({providedIn: 'root'})
export class BpmnTemplateService {
  public addGoJsBPMNNodeFields(nodeData: any, modellingLanguageConstruct: string) {
    const dicEntry = Mappers.dictionaryAOAMEBPMNElementToGoJsNode.get(modellingLanguageConstruct);
    if (!dicEntry) {
      nodeData.category = 'customNode';
      return;
    }
    // nodeData.key = dicEntry.key;
    nodeData.category = dicEntry.category;
    nodeData.taskType = dicEntry.taskType;
    nodeData.isLoop = dicEntry.isLoop;
    nodeData.isSubProcess = dicEntry.isSubProcess;
    nodeData.isTransaction = dicEntry.isTransaction;
    nodeData.isGroup = dicEntry.isGroup;
    nodeData.isSequential = dicEntry.isSequential;
    nodeData.isAdHoc = dicEntry.isAdHoc;
    nodeData.eventType = dicEntry.eventType;
    nodeData.eventDimension = dicEntry.eventDimension;
    nodeData.gatewayType = dicEntry.gatewayType;
  }

  public addGoJsBPMNLinkFields(nodeData: any, element: ModelElementDetail) {
    const dicEntry = Mappers.dictionaryGoJsAOAMELinkIdToLinkCategory.get(element.modellingLanguageConstruct);
    if (dicEntry === undefined || !this.isMappableBPMNConnection(element.fromShape, element.toShape)) {
      nodeData.category = 'customLink';
      return;
    }
    // nodeData.key = dicEntry.key;
    nodeData.category = dicEntry;
  }

  public addGoJsBPMNGroupFields(nodeData: any, modellingLanguageConstruct: string) {
    const dicEntry = Mappers.dictionaryAOAMEBPMNGroupToGoJsGroup.get(modellingLanguageConstruct);
    if (!dicEntry) {
      nodeData.category = 'customGroup';
      return;
    }
    // nodeData.key = dicEntry.key;
    nodeData.category = dicEntry.category;
    nodeData.isGroup = dicEntry.isGroup;
    // nodeData.group = dicEntry.group;
    nodeData.color = dicEntry.color;
  }

  public addAdditionalCreateOptions(toData: any, additionalCreateOptions: AdditionalCreateOptions) {
    toData.loc = additionalCreateOptions.loc;
    toData.size = additionalCreateOptions.size;
    toData.group = additionalCreateOptions.group;
  }

  public isMappableBPMNConnection(fromShape: string, toShape: string): boolean {
    const from = fromShape.split('_')[0];
    const to = toShape.split('_')[0];
    const goJsNodeFrom = Mappers.dictionaryAOAMEBPMNElementToGoJsNode.get(from);
    const goJsNodeTo = Mappers.dictionaryAOAMEBPMNElementToGoJsNode.get(to);
    const goJsGroupFrom = Mappers.dictionaryAOAMEBPMNGroupToGoJsGroup.get(from);
    const goJsGroupTo = Mappers.dictionaryAOAMEBPMNGroupToGoJsGroup.get(to);

    if (goJsNodeFrom?.category === 'annotation') {
      return true;
    } else if (goJsNodeFrom?.category === 'dataobject' || goJsNodeTo?.category === 'dataobject') {
      return true;
    } else if (goJsNodeFrom?.category === 'datastore' || goJsNodeTo?.category === 'datastore') {
      return true;
    } else if ((goJsNodeFrom || goJsGroupFrom) && (goJsNodeTo || goJsGroupTo)) {
      return true;
    }
    return false;
  }

  // conversion functions used by data Bindings
  nodeActivityTaskTypeConverter(s: number): Array<string> | string {
    const tasks = ['Empty',
      'BpmnTaskMessage',
      'BpmnTaskUser',
      'BpmnTaskManual',   // Custom hand symbol
      'BpmnTaskScript',
      'BpmnTaskMessage',  // should be black on white
      'BpmnTaskService',  // Custom gear symbol
      'InternalStorage'];
    if (s < tasks.length) {
      console.log(tasks[s]);
      return tasks[s];
    }
    return 'NotAllowed'; // error
  }

  public nodeActivityTaskTypeColorConverter(s: number) {
    return (s === 5) ? 'dimgray' : 'white';
  }

  public nodeEventTypeConverter(s: number) {  // order here from BPMN 2.0 poster
    const tasks = ['NotAllowed',
      'Empty',
      'BpmnTaskMessage',
      'BpmnEventTimer',
      'BpmnEventEscalation',
      'BpmnEventConditional',
      'Arrow',
      'BpmnEventError',
      'ThinX',
      'BpmnActivityCompensation',
      'Triangle',
      'Pentagon',
      'ThinCross',
      'Circle'];
    if (s < tasks.length) {
      return tasks[s];
    }
    return 'NotAllowed'; // error
  }

  public nodeEventDimensionStrokeColorConverter(s: number) {
    if (s === 8) {
      return BpmnConstantsClass.EventDimensionStrokeEndColor;
    }
    return BpmnConstantsClass.EventDimensionStrokeColor;
  }

  public nodeEventDimensionSymbolFillConverter(s: number) {
    if (s <= 6) {
      return BpmnConstantsClass.EventSymbolLightFill;
    }
    return BpmnConstantsClass.EventSymbolDarkFill;
  }

  // sub-process,  loop, parallel, sequential, ad doc and compensation markers in horizontal array


  // sub-process,  loop, parallel, sequential, ad doc and compensation markers in horizontal array


  public nodeGatewaySymbolTypeConverter(s: number) {
    const tasks = ['NotAllowed',
      'ThinCross',      // 1 - Parallel
      'Circle',         // 2 - Inclusive
      'AsteriskLine',   // 3 - Complex
      'ThinX',          // 4 - Exclusive  (exclusive can also be no symbol, just bind to visible=false for no symbol)
      'Pentagon',       // 5 - double cicle event based gateway
      'Pentagon',       // 6 - exclusive event gateway to start a process (single circle)
      'ThinCross'];   // 7 - parallel event gateway to start a process (single circle)
    if (s < tasks.length) {
      return tasks[s];
    }
    return 'NotAllowed'; // error
  }

  // tweak the size of some of the gateway icons

  isElementMappedToBPMNMappers(element: PaletteElementModel): boolean {
    const elementType = PaletteElementModel.getProbableElementType(element);
    if (elementType === 'ModelingElement' || elementType === 'ModelingContainer') {
      const modellingLanguageConstruct = PaletteElementModel.getProbableModellingConstruct(element);
      return !!Mappers.dictionaryAOAMEBPMNElementToGoJsNode.get(modellingLanguageConstruct)
        || !!Mappers.dictionaryAOAMEBPMNGroupToGoJsGroup.get(modellingLanguageConstruct);
    }
    return false;
  }

  isElementBlacklisted(element: PaletteElementModel) {
    if (PaletteElementModel.getProbableElementType(element) === 'ModelingContainer'
      && PaletteElementModel.getProbableModellingConstruct(element) === 'Lane') {
      return true;
    }
    return false;
  }
}
