import Overlay from 'ol/Overlay';
import intSelect from "ol/interaction/Select"; //地图监听函数
import MAP from "../index"
import Feature from 'ol/Feature';//特点
import { Point } from 'ol/geom';
//鼠标移入显示点数据
function mousemoveed(map, Customelement) {
    var showMesOverlayEle = document.getElementById('showmessage');
    var showHisOverlayEle = document.getElementById('showhismessage')
    const showMesOverlay = new Overlay({
        element: showMesOverlayEle
    });
    const showHisOverlay = new Overlay({
        element: showHisOverlayEle
    });

    map.on('pointermove', function (evt) {
        map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ?
            "pointer" :
            "";
        var center = evt.coordinate;
        var features = map.getFeaturesAtPixel(evt.pixel);
        if (features.length != 0 && features[0].get("type")) {
            if (features[0].get("type") != 'history') {
                var f = features[0];//显示第一个元素
                // var center = f.get('geom').getCoordinates();
                var value =
                    "船名：" + f.get('name') + "<br/>" +
                    "MMSI：" + f.get('mmsi') + "<br/>" +
                    "时间：" + f.get('time') + "<br/>" + Customelement(f, value);
                showMesOverlayEle.className = "showMesOverlay";
                showMesOverlayEle.innerHTML = value;
                showMesOverlay.setPosition(center);
                showMesOverlay.setOffset([10, 20]);
                map.addOverlay(showMesOverlay);
            } else {
                var f = features[0];//显示第一个元素
                // var center = f.get('geom').getCoordinates();
                var value =
                    "纬度：" + f.get('latStr') + "<br/>" +
                    "经度：" + f.get('lonStr') + "<br/>" +
                    "时间：" + f.get('time') + "<br/>" + Customelement(f, value);
                Customelement(f, value)
                showHisOverlayEle.className = "showMesHisOverlay";
                showHisOverlayEle.innerHTML = value;
                showHisOverlay.setPosition(center);
                showHisOverlay.setOffset([10, 20]);
                map.addOverlay(showHisOverlay);
            }

        } else {
            showMesOverlayEle.className = "";
            showMesOverlayEle.innerHTML = '';
            showHisOverlayEle.className = "";
            showHisOverlayEle.innerHTML = '';
            map.removeOverlay(showMesOverlay);
            map.removeOverlay(showHisOverlay);
        }
    });
}
//选中框
function SelectKuang(map, layers, id, type, isclear = true) {
    //添加选择框
    let selectlayer = MAP.GetLayersById(map, "ShipSelectKuang")
    let f = null;
    if (isclear) {
        selectlayer.getSource().clear()
    }
    layers.forEach(item => {
        item.getSource().getFeatureById(id) && (f = item.getSource().getFeatureById(id));
    })
    if (type != 'other') {
        var p = new Point(f.get("geom").getCoordinates());
    } else {
        var p = new Point(transform([id.lon / 60 / 10000, id.lat / 60 / 10000], "EPSG:4326", "EPSG:3857"))
    }
    let s = new Feature({
        geometry: p,
        geom: p
    });
    selectlayer.getSource().addFeature(s);
}
//实现地图交互功能
//map对象 layers需要监听的图层 选中方法 feature类型 元素选中后渲染图层
function InteractionSelect(map, featuretypeandlayer, featurevalue, selectlayer) {
    let layers = Object.values(featuretypeandlayer)
    let types = Object.keys(featuretypeandlayer)
    console.log(featuretypeandlayer);
    let shipClick = new intSelect({
        layers,
    });
    shipClick.on("select", function (evt) {
        shipClick.getFeatures().clear();

        let f = evt.selected[0];
        if (f) {
            console.log(types);
            if (types.includes(f.get('type'))) {
                f.setStyle(null)
                console.log(Object.values(selectlayer));
                Object.values(selectlayer)[0].getSource().clear()
                /*ais网格使用的船舶交互方法
                    Object.values(selectlayer)[0].getSource().addFeature(f)
                    if (!f.getId()) {
                        console.error("No feature corresponding to id found");
                    } else {
                        SelectKuang(map, layers, f.getId(), f.get('type'))
                    }
                */
            }
        }
        featurevalue(f, layers)
    });
    map.addInteraction(shipClick);
    return;
}
function MouseMethods(map, Customelement = () => "") {
    mousemoveed(map, Customelement)
}

export default { MouseMethods, InteractionSelect, SelectKuang }