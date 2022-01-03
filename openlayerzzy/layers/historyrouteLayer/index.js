import Vector from "ol/layer/Vector"; //图层
import SourceVector from "ol/source/Vector"; //资源
import {
    historyPointStyle,
    historylineStyle
} from "./style"
const ShipHistoryLayer = new Object({})
// 历史轨迹点图层
ShipHistoryLayer.ShipHistoryPointLayer =
    new Vector({
        className: "ShipHistoryPointLayer",
        source: new SourceVector(),//继承ShipSource里的方法
        zIndex: 20,
        style: (f, r) => historyPointStyle(f, r)
    })
ShipHistoryLayer.ShipHistoryPointLayer.set("layerId", 'ShipHistoryPointLayer')
//历史轨迹线图层
ShipHistoryLayer.ShipHistoryLineLayer =
    new Vector({
        className: "ShipHistoryLineLayer",
        source: new SourceVector(), //继承ShipSource里的方法
        zIndex: 19,
        style: historylineStyle()
    })
ShipHistoryLayer.ShipHistoryLineLayer.set("layerId", 'ShipHistoryLineLayer')
export default ShipHistoryLayer