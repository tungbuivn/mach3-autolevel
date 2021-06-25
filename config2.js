const zSafe = 5;

const drillToolDiameter = 0.6;
const drillFeedRate = 50;
const drillDepth = -1.8;

const bottomLayerFeedRate = 100;
const bottomLayerMillingDepth = 0.1;
const bottomLayerToolDiameter = 0.5;

const cutoutDepth = -2;
const cutoutDepthPerpass = 0.5;
const cutoutFeedRate = 600;
const cutoutToolDiameter = 1.5;

const spindleSpeed = 12000;

export class Config {
  constructor() {
    this.zSafe = zSafe;
    this.drillToolDiameter = drillToolDiameter;
    this.drillFeedRate = drillFeedRate;
    this.drillDepth = drillDepth;
    this.bottomLayerFeedRate = bottomLayerFeedRate;
    this.bottomLayerMillingDepth = bottomLayerMillingDepth;
    this.bottomLayerToolDiameter = bottomLayerToolDiameter;
    this.cutoutDepth = cutoutDepth;
    this.cutoutDepthPerpass = cutoutDepthPerpass;
    this.cutoutFeedRate = cutoutFeedRate;
    this.cutoutToolDiameter = cutoutToolDiameter;
    this.spindleSpeed = spindleSpeed;
  }
}
// module.exports = Config;
