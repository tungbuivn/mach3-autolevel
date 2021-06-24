const zSafe = 5;

const drillToolDiameter = 0.6;
const drillFeedRate = 50;
const drillDepth = -1.8;

const bottomLayerFeedRate = 100;
const bottomLayerToolDiameter = 0.2;

const cutoutDepth = -2;
const cutoutDepthPerpass = 0.5;
const cutoutFeedRate = 600;
const cutoutToolDiameter = 1.5;

const spindleSpeed = 12000;
module.exports = function () {
  return {
    zSafe,

    drillToolDiameter,
    drillFeedRate,
    drillDepth,

    bottomLayerFeedRate,
    bottomLayerToolDiameter,

    cutoutDepth,
    cutoutDepthPerpass,
    cutoutFeedRate,
    cutoutToolDiameter,

    spindleSpeed,
  };
};
