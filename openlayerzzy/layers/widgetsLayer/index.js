import 'ol/ol.css';
import Graticule from 'ol/layer/Graticule'; //经纬网
//添加的图层
const WidgetsLayers = new Object({})
//经纬度网格--
WidgetsLayers.GridsLayer = new Graticule({
    showLabels: true,
    wrapX: true,
    zIndex: 99,
    className: "GridsLayer",
    visible: false
})
WidgetsLayers.GridsLayer.set("layerId", 'GridsLayer')
//--经纬度网格




export default WidgetsLayers