import WebGLPointsLayer from "ol/layer/WebGLPoints";//webgl图层
import SourceVector from "ol/source/Vector"; //资源
//船队船舶webgl--
const WebglLayer = new Object({})
WebglLayer.PurplePoint = new WebGLPointsLayer({
    zIndex: 25,
    source: new SourceVector(),
    style: {
        symbol: {
            symbolType: "circle",
            size: 7,
            color: "rgb(163, 16, 255)",
            rotateWithView: false,
            offset: [0, 0],
            opacity: 0.7
        }
    },
    className: 'PurplePoint',
    disableHitDetection: false
});
WebglLayer.PurplePoint.set("layerId", 'PurplePoint')
//--船队船舶webgl

export default WebglLayer