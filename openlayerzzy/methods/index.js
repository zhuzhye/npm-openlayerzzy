import Createmap from "./createmap/createmap";
import Layers from "../layers/layers"
import Measurement from "./stadiometry/stadiometry"
import Acustomfunction from "./acustomfunction/methods"
import Widgets from "./widgets/widgets"
import AddAreaLine from "./arealine/arealine"
import DrawShip from "./drawship/drawship"
import Interaction from "./interaction/index"
import Histroy  from "./historyroute/history"
import DrawWebglPoint from "./webgl/index"
export default {
  ...Createmap,
  Layers,
  Measurement,
  ...Acustomfunction,
  ...AddAreaLine,
  ...Widgets,
  ...DrawShip,
  ...Interaction,
  ...Histroy,
  ...DrawWebglPoint
};
