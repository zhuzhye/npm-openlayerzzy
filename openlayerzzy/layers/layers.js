import BaseLayers from "./baselayer/index"
import DrawLayers from "./drawLayer/index"
import { AreaLineLayer } from "./arealineLayer/index"
import Widgets from "./widgetsLayer/index"
import ShipLayers from "./shipLayer/index"
import HistoryLayer from "./historyrouteLayer/index"
import WebglLayer from "./webglLayer/index"
//合并所有图层
const Layers = new Object({})
Object.assign(Layers, BaseLayers)
Object.assign(Layers, DrawLayers)
Object.assign(Layers, AreaLineLayer)
Object.assign(Layers, Widgets)
Object.assign(Layers, ShipLayers)
Object.assign(Layers, HistoryLayer)
Object.assign(Layers, WebglLayer)

export default Layers