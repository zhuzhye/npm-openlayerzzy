import {
    Style, //样式
    Fill, //填充
    Stroke, //描边
    Circle, //圆
    Icon, //图标
    Text, //文字
} from 'ol/style'

import start from "./image/start.png"
import end from "./image/end.png"
//历史轨迹点的样式
function historyPointStyle(f) {
    return new Style({
        image: new Circle({
            radius: 1,
            fill: new Fill({
                color: 'rgb(50, 114, 221)'
            }),
        }),

    })
}
//历史轨迹线的样式
function historylineStyle() {
    return new Style({
        stroke: new Stroke({
            // color: "rgba(0, 0, 255,0.7)",
            color: 'rgba(128,128,128,0.7)',
            width: 2
        })
    });
};
//历史轨迹日期连线
function connectline() {
    return new Style({
        fill: new Fill({
            color: "rgba(0, 0, 255,0.7)",
        }),
        stroke: new Stroke({
            color: "rgba(0, 0, 255,0.7)",
            width: 0.5
        })
    });
}
//历史轨迹样式
function pathStyle(data, i, data2, re = null) {
    var dx = data2.lon - data.lon;
    var dy = data2.lat - data.lat;
    var rotation = Math.atan2(dy, dx);
    return new Style({
        image: new Icon({
            color: "#fff",
            anchor: [0.5, 0.5],
            rotateWithView: true,
            rotation: -rotation,
            src: require("./image/icon3.png")
        }),
        text: new Text({
            textAlign: "left",
            font: "10px Microsoft YaHei",
            fill: new Fill({ color: "#5F88AA" }),
            stroke: new Stroke({ color: "#FFF", width: 3 }),
            textBaseline: "bottom",
            offsetX: re ? re.offsetX : 0,
            offsetY: re ? re.offsetY : 0,
            text: re && (i - 1) % 2 == 0 ? data.pt : ''
        })
    });
};
//历史轨迹开始结束点的样式
function pathSEStyle(state, re, data) {
    let style = null;
    if (state == "start") {
        style = new Style({
            image: new Icon({
                src: start,
                anchor: [0.5, 1]
            }),
            text: new Text({
                textAlign: "left",
                font: "10px Microsoft YaHei",
                fill: new Fill({ color: "#5F88AA" }),
                stroke: new Stroke({ color: "#FFF", width: 3 }),
                textBaseline: "bottom",
                offsetX: re.offsetX,
                offsetY: re.offsetY,
                text: data.pt
            })
        });
    } else {
        style = new Style({
            image: new Icon({
                src: end,
                anchor: [0.5, 1]
            }),
            text: new Text({
                textAlign: "left",
                font: "10px Microsoft YaHei",
                fill: new Fill({ color: "#5F88AA" }),
                stroke: new Stroke({ color: "#FFF", width: 3 }),
                textBaseline: "bottom",
                offsetX: re.offsetX,
                offsetY: re.offsetY,
                text: data.pt
            })
        });
    }
    return style;
}
export  {
    historyPointStyle,
    historylineStyle,
    connectline,
    pathStyle,
    pathSEStyle
}