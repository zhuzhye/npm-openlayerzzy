import Vector from "ol/layer/Vector"; //图层
import SourceVector from "ol/source/Vector"; //资源
import ShipStyle from "./style"
//船队船舶--
const ShipLayers = new Object({})
ShipLayers.ShipGoupLayer = new Vector({
    source: new SourceVector(),
    style: (f, r) => ShipStyle.ShipStyle(f, r),
    zIndex: 20,
    className: 'ShipGroupLayer'
});
ShipLayers.ShipGoupLayer.set("layerId", 'ShipGroupLayer')
//--船队船舶

//关注船舶--
ShipLayers.ShipFocusLayer = new Vector({
    source: new SourceVector(),
    style: (f, r) => ShipStyle.ShipStyle(f, r),
    zIndex: 20,
    className: 'ShipFocusLayer'
});
ShipLayers.ShipFocusLayer.set("layerId", 'ShipFocusLayer')
//--关注船舶

//选中查找船舶--
ShipLayers.ShipFindLayer = new Vector({
    source: new SourceVector(),
    style: (f, r) => ShipStyle.ShipStyle(f, r),
    zIndex: 20,
    className: 'ShipFindLayer'
});
ShipLayers.ShipFindLayer.set("layerId", 'ShipFindLayer')
//--选中查找船舶

//选中框--
ShipLayers.ShipSelectKuang = new Vector({
    className: "ShipSelectKuang",
    source: new SourceVector(),
    style:(f,r)=>ShipStyle.SelectStyle,
    zIndex: 25
})
ShipLayers.ShipSelectKuang.set("layerId", 'ShipSelectKuang')
//--选中框

export default ShipLayers