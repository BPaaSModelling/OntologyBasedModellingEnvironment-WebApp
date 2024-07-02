

export class BpmnConstantsClass {
  // constants for design choices

  static ActivityNodeStroke = '#CDAA7D';
  static ActivityMarkerStrokeWidth = 1.5;
  static ActivityNodeWidth = 120;
  static ActivityNodeHeight = 80;
  static ActivityNodeStrokeWidth = 1;
  static ActivityNodeStrokeWidthIsCall = 4;

  // @ts-ignore
  static SubprocessNodeFill = BpmnConstantsClass.ActivityNodeFill;
  static SubprocessNodeStroke = BpmnConstantsClass.ActivityNodeStroke;

  static EventNodeSize = 42;
  static EventNodeInnerSize = BpmnConstantsClass.EventNodeSize - 6;
  static EventNodeSymbolSize = BpmnConstantsClass.EventNodeInnerSize - 14;
  static EventEndOuterFillColor = 'pink';
  // @ts-ignore
  static EventBackgroundColor = BpmnConstantsClass.GradientLightGreen;
  static EventSymbolLightFill = 'white';
  static EventSymbolDarkFill = 'dimgray';
  static EventDimensionStrokeColor = 'green';
  static EventDimensionStrokeEndColor = 'red';
  static EventNodeStrokeWidthIsEnd = 4;

  static GatewayNodeSize = 80;
  static GatewayNodeSymbolSize = 45;
  static GatewayNodeStroke = 'darkgoldenrod';
  static GatewayNodeSymbolStroke = 'darkgoldenrod';

  static GatewayNodeSymbolStrokeWidth = 3;


  static Palscale = 2;

  private static GradientLightGreen: string;
  private static GradientYellow: string;
  private static ActivityNodeFill: string;
}
