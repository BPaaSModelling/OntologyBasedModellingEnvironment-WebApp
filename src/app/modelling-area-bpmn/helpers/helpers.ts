import * as go from 'gojs';

export class Helpers {
  static MINLENGTH = 400;  // this controls the minimum length of any swimlane
  static MINBREADTH = 20;  // this controls the minimum breadth of any non-collapsed swimlane

  // compute the minimum size of a Pool Group needed to hold all of the Lane Groups
  static computeMinPoolSize(pool: go.Group) {
    // assert(pool instanceof go.Group && pool.category === "Pool");
    let len = Helpers.MINLENGTH;
    pool.memberParts.each(function (lane) {
      // pools ought to only contain lanes, not plain Nodes
      if (!(lane instanceof go.Group)) { return; }
      const holder = lane.placeholder;
      if (holder !== null) {
        const sz = holder.actualBounds;
        len = Math.max(len, sz.width);
      }
    });
    return new go.Size(len, NaN);
  }

  static assignGroupLayer(grp: go.Part): void {
    if (!(grp instanceof go.Group)) { return; }
    let lay = grp.isSelected ? 'Foreground' : '';
    grp.layerName = lay;
    grp.findSubGraphParts().each(function(m: go.Part) { m.layerName = lay; });
  }
}
