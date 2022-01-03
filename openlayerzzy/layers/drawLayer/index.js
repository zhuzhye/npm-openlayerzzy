import 'ol/ol.css';
import SourceVector from "ol/source/Vector"; //资源
import Vector from "ol/layer/Vector"; //图层
import DrawStyle from "./style"
//添加的图层
const DrawLayers = new Object({})
//测距--
DrawLayers.DrawLineLayer = new Vector({
    source: new SourceVector(),
    zIndex: 15,
    style: DrawStyle.MeasureStyle
});
DrawLayers.DrawLineLayer.set("layerId", 'DrawLineLayer')
//--测距
export default DrawLayers