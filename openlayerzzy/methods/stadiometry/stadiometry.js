import { unByKey } from "ol/Observable"; //取消监听
import Overlay from "ol/Overlay"; //矢量对象
import Draw from "ol/interaction/Draw"; //画线工具
import styleFill from "ol/style/Fill"; //添加填充样式
import styleStroke from "ol/style/Stroke"; //添加填充样式
import Style from "ol/style/Style"; //样式总类
import styleCircle from "ol/style/Circle"; //添加填充样式
import LineString from "ol/geom/LineString"; //线
import { getLength } from "ol/sphere";//获取长度

const measuretarget = new Object({
    measureTooltipElement: null, //轨迹显示距离的div
    measureTooltip: null //轨迹显示距离绑定位置
})

const measuremethods = new Object({
    formatLength: null,
    createMeasureTooltip: null
})

//获取测距的长度
measuremethods.formatLength = function (line) {
    let length = getLength(line);
    let output;
    output = (length / 1852).toFixed(2) + " " + "海里";
    return output;
};

//设置绑定轨迹数据的div
measuremethods.createMeasureTooltip = function (map) {
    if (measuretarget.measureTooltipElement) {
        measuretarget.measureTooltipElement.parentNode.removeChild(
            measuretarget.measureTooltipElement
        );
    }
    measuretarget.measureTooltipElement = document.createElement("div");
    measuretarget.measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measuretarget.measureTooltip = new Overlay({
        element: measuretarget.measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center"
    });
    map.addOverlay(measuretarget.measureTooltip);
};

//通过id获取图层 传入map对象，图层id值
function GetLayersById(map, LayerId) {
    return map
        .getLayers()
        .getArray()
        .filter((e) => {
            return e.get("layerId") == LayerId;
        })[0];
}

//清理测距线
function CleanLine(deleteid, DrawLineLayer, map) {
    DrawLineLayer.getSource().forEachFeature((n) => {
        if (n.ol_uid == deleteid) {
            DrawLineLayer.getSource().removeFeature(n);
        }
    });
    map.getOverlays().getArray().forEach((item) => {
        if (
            item.values_.element &&
            item.values_.element.getAttribute("id") == deleteid
        ) {
            map.removeOverlay(item);
        }
    });
}

//需要传入map对象 , 需要绘画出测量图层
function measurement(map, DrawLineLayerId) {
    measuremethods.createMeasureTooltip(map)
    let DrawLineLayer = GetLayersById(map, DrawLineLayerId)
    let drawRingDraw = new Draw({
        source: DrawLineLayer.getSource(),
        type: "LineString",
        style: new Style({
            fill: new styleFill({
                color: "rgba(255, 255, 255, 0.2)"
            }),
            stroke: new styleStroke({
                color: "rgba(0, 0, 0, 0.5)",
                lineDash: [10, 10],
                width: 2
            }),
            image: new styleCircle({
                radius: 5,
                stroke: new styleStroke({
                    color: "rgba(0, 0, 0, 0.7)"
                }),
                fill: new styleFill({
                    color: "rgba(255, 255, 255, 0.2)"
                })
            })
        })
    });
    map.addInteraction(drawRingDraw);
    let listener = null;
    let sketch = null;
    drawRingDraw.on("drawstart", function (e) {
        let tooltipCoord = e.coordinate;
        sketch = e.feature;
        listener = sketch.getGeometry().on("change", function (evt) {
            let geom = evt.target;
            let output;
            if (geom instanceof LineString) {
                output = measuremethods.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measuretarget.measureTooltipElement.innerHTML =
                output +
                "" +
                `<span  id='closeicon' class="el-icon-circle-close"  style="margin-left: 9px;cursor: pointer;font-size:16px;font-weight:bold"   ></span>`;
            measuretarget.measureTooltip.setPosition(tooltipCoord);

        });
    });
    drawRingDraw.on("drawend", function (e) {
        map.removeInteraction(drawRingDraw);
        document.getElementById("closeicon").onclick = function () {
            CleanLine(e.feature.ol_uid, DrawLineLayer, map)
        }
        measuretarget.measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
        // shipMap.measureTooltipElement.setAttribute("name", "ceju");
        measuretarget.measureTooltipElement.setAttribute("id", sketch.ol_uid);
        measuretarget.measureTooltip.setOffset([0, -7]);
        sketch = null;
        measuretarget.measureTooltipElement = null;
        measuremethods.createMeasureTooltip(map);
        unByKey(listener);
    });
}
export default measurement