import moment from "moment"
import {
    connectline,
    pathStyle,
    pathSEStyle
} from "../../layers/historyrouteLayer/style"
import fifterData from "./vacuate"
import { transform } from "ol/proj";
import { Point, LineString } from 'ol/geom';
import Feature from 'ol/Feature';
import MAP from "../index"
class addhistorymethods {
    constructor(historypointLayerId, historylineLayerId, map) {
        this.__tsize = []
        this.heigthKey = 14
        this.screenText = {};
        this.historypointLayer = MAP.GetLayersById(map, historypointLayerId)
        this.historylineLayer = MAP.GetLayersById(map, historylineLayerId)
    }

    //添加历史轨迹
    addhistory(dataList, map, minpx, mimangle, allpoint) {
        this.clearScreenText()
        let Coor = [];
        this.historylineLayer.getSource().clear()
        this.historypointLayer.getSource().clear()
        var dataFifterList = fifterData(dataList, map, minpx, mimangle, allpoint);
        for (let i = 0; i < dataFifterList.length; i++) {
            let coor = transform([dataFifterList[i].lon / 60 / 10000, dataFifterList[i].lat / 60 / 10000], 'EPSG:4326', 'EPSG:3857');
            Coor.push(coor);
        }
        let line = new LineString(Coor); //这是已知点画线
        //多边形要素类
        let FeatureLine = new Feature({
            geometry: line,
        });
        this.historylineLayer.getSource().addFeature(FeatureLine);
        for (let i = 0; i < dataFifterList.length; i++) {
            let point = new Point(Coor[i]);
            var FeaturePoint = new Feature({
                geometry: point,
                lon: dataFifterList[i].lon / 60 / 10000,
                lat: dataFifterList[i].lat / 60 / 10000,
                lonStr: MAP.CacuLonLat(dataFifterList[i].lon / 60 / 10000, 'lon', 'String'),
                latStr: MAP.CacuLonLat(dataFifterList[i].lat / 60 / 10000, 'lat', 'String'),
                index: i + 1,
                time: dataFifterList[i].pt,
                tp: dataFifterList[i].tp,
                speed: dataFifterList[i].sp / 10,
                course: dataFifterList[i].co / 10,
                type: 'history'
            });
            FeaturePoint.set('geom', point);
            FeaturePoint.setId(Coor[i][0] + Coor[i][1]);
            let size = this.textsize(dataFifterList[i].pt.split(" ")[1]);
            var center = {};
            let pix = map.getPixelFromCoordinate(
                FeaturePoint.getGeometry().getCoordinates()
            );
            center.left = Math.round(pix[0]);
            center.top = Math.round(pix[1]);
            var re = this.calcLablePos(center, size, dataFifterList[i].pt);
            this.historypointLayer.getSource().addFeature(FeaturePoint);
            if (re.canDraw) {
                if (Math.abs(re.offsetY) < 10) {
                    if (re.offsetY <= 0) {
                        re.offsetY = -10;
                    } else re.offsetY = 10;
                }

                var e = [];
                e[0] = pix[0];
                e[1] = pix[1];
                if (re.offsetX > 0) {
                    e[0] += 10;
                    e[1] += re.offsetY;
                }
                if (re.offsetX < 0) {
                    e[0] -= 10;
                    e[1] += re.offsetY;
                }
                var end = map.getCoordinateFromPixel(e);

                if (i > 0 && i < Coor.length - 1) {
                    // console.log(re, i, "reererererererere");
                    FeaturePoint.setStyle(
                        pathStyle(dataFifterList[i], i + 1, dataFifterList[i + 1], re)
                    );
                }
                this.historypointLayer.getSource().addFeature(FeaturePoint);
                if (i % 2 == 0) {
                    this.textLine(Coor[i], end);
                }
            } else {
                if (i > 0 && i < Coor.length - 1) {
                    FeaturePoint.setStyle(
                        pathStyle(dataFifterList[i], i + 1, dataFifterList[i + 1])
                    );
                    this.historypointLayer.getSource().addFeature(FeaturePoint);
                }
            }
            if (i == 0) {
                let pointStart = new Point(Coor[i]);
                let startF = new Feature({
                    geometry: pointStart
                });
                startF.setStyle(pathSEStyle("start", re, dataFifterList[0]));
                this.historypointLayer.getSource().addFeature(startF);
                this.textLine(Coor[i], end);
            }
            if (i == dataFifterList.length - 1) {
                console.log(Coor[i], "Coor[i]Coor[i]");
                let pointEnd = new Point(Coor[i]);
                let endF = new Feature({
                    geometry: pointEnd
                });
                endF.setStyle(
                    pathSEStyle("end", re, dataFifterList[dataFifterList.length - 1])
                );
                this.historypointLayer.getSource().addFeature(endF);
                this.textLine(Coor[i], end);
                console.log("+++++++++++++++++++++++++++++++++++++++++++++++");
            }
        }
    }
    textsize(text) {
        if (this.__tsize[text]) {
            return this.__tsize[text];
        }
        var result = {};
        var span = this._$("__testStringWide");
        if (!span) {
            span = document.createElement("span");
            span.id = "__testStringWide";
            span.style.font = "16px Microsoft YaHei 100";
            span.style.whiteSpace = "nowrap";
            span.style.visibility = "hidden";
            document.body.appendChild(span);
        }
        if (typeof span.textContent != "undefined") span.textContent = "";
        else span.innerText = "";

        result.width = span.offsetWidth;
        result.height = span.offsetWidth;
        if (typeof span.textContent != "undefined") span.textContent = text;
        else span.innerText = text;
        // console.log(span.offsetWidth);
        result.width = span.offsetWidth - result.width + 6;
        result.height = 22;
        this.__tsize[text] = result;
        // console.log(result, "reslutssssssssssssssssssssss");
        return result;
    }
    _$(d) {
        return document.getElementById(d);
    }
    calcLablePos(center, size, id) {
        var result = {};
        var pos = {};
        pos.l = Math.round((center.left + 20) / 30);
        pos.length = Math.round(size.width / 30) + 1;
        pos.t = Math.round(center.top / 30) - 1;
        var hasLable = false;
        for (var i = pos.l; i < pos.l + pos.length; i++) {
            var o = this.screenText[i + "-" + pos.t];
            if (o) {
                if (o != id) {
                    hasLable = true;
                    break;
                }
            }
        }
        if (!hasLable) {
            result.canDraw = true;
            result.offsetX = 10;
            result.offsetY = -this.heigthKey - (center.top - (pos.t + 1) * 30);
            // console.log(result.offsetY);
            for (var i = pos.l; i < pos.l + pos.length; i++) {
                this.screenText[i + "-" + pos.t] = id;
            }
            return result;
        }
        pos.t = Math.round(center.top / 30) + 1;
        hasLable = false;
        for (var i = pos.l; i < pos.l + pos.length; i++) {
            var o = this.screenText[i + "-" + pos.t];
            if (o) {
                if (o != id) {
                    hasLable = true;
                    break;
                }
            }
        }
        if (!hasLable) {
            result.canDraw = true;
            result.offsetX = 10;
            result.offsetY = -this.heigthKey - (center.top - (pos.t + 1) * 30);
            for (var i = pos.l; i < pos.l + pos.length; i++) {
                this.screenText[i + "-" + pos.t] = id;
            }
            return result;
        }
        pos.t = Math.round(center.top / 30) + 1;
        hasLable = false;
        for (var i = pos.l; i < pos.l + pos.length; i++) {
            var o = this.screenText[i + "-" + pos.t];
            if (o) {
                if (o != id) {
                    hasLable = true;
                    break;
                }
            }
        }
        if (!hasLable) {
            result.canDraw = true;
            result.offsetX = 10;
            result.offsetY = this.heigthKey - (center.top - (pos.t - 1) * 30);
            for (var i = pos.l; i < pos.l + pos.length; i++) {
                this.screenText[i + "-" + pos.t] = id;
            }
            return result;
        }
        pos.length = Math.round(size.width / 30);
        pos.l = Math.round((center.left - size.width - 10) / 30) - 1;
        pos.t = Math.round(center.top / 30) - 1;
        hasLable = false;
        for (var i = pos.l; i < pos.l + pos.length; i++) {
            var o = this.screenText[i + "-" + pos.t];
            if (o) {
                if (o != id) {
                    hasLable = true;
                    break;
                }
            }
        }
        if (!hasLable) {
            result.canDraw = true;
            result.offsetX = -size.width - 10;
            result.offsetY = -this.heigthKey - (center.top - (pos.t + 1) * 30);
            for (var i = pos.l; i < pos.l + pos.length; i++) {
                this.screenText[i + "-" + pos.t] = id;
            }
            return result;
        }
        pos.t = Math.round(center.top / 30) + 1;
        hasLable = false;
        for (var i = pos.l; i < pos.l + pos.length; i++) {
            var o = this.screenText[i + "-" + pos.t];
            if (o) {
                if (o != id) {
                    hasLable = true;
                    break;
                }
            }
        }
        if (!hasLable) {
            result.canDraw = true;
            result.offsetX = -size.width - 10;
            result.offsetY = this.heigthKey - (center.top - (pos.t - 1) * 30);
            for (var i = pos.l; i < pos.l + pos.length; i++) {
                this.screenText[i + "-" + pos.t] = id;
            }
            return result;
        }
        return result;
    };
    textLine(coor, end) {
        var newline = new LineString([coor, end]);
        var concatline = new Feature({
            geometry: newline
        });
        concatline.setStyle(connectline());
        this.historypointLayer.getSource().addFeature(concatline);
    };
    clearScreenText() {
        for (var key in this.screenText) {
            delete this.screenText[key];
        }
    }
}

class addhistroy {
    constructor(map) {
        this.map = map
    }
    GetTime(day) {
        if (day) {
            var data = new Date().getTime();
            var end = new Date();
            var start = null;
            var dayDay = null;
            switch (day) {
                case "one":
                    start = new Date(data);
                    dayDay = "1天";
                    break;
                case "three":
                    start = new Date(data - 86400000 * 2);
                    dayDay = "3天";
                    break;
                case "seven":
                    start = new Date(data - 86400000 * 6);
                    dayDay = "7天";
                    break;
            }
            let endTime = moment(end).format("YYYY-MM-DD 23:59:59");
            let startTime = moment(start).format("YYYY-MM-DD 00:00:00");
            return [startTime, endTime]
        } else {
            let startTime = moment(startTime).format(
                "YYYY-MM-DD HH:mm:ss"
            );
            let endTime = moment(endTime).format(
                "YYYY-MM-DD HH:mm:ss"
            );
            return [startTime, endTime]
        }
    }
}
function HistroyTime(day) {
    // 返回日期
    return new Promise((resovle, reject) => {
        const time = new addhistroy()
        let date = time.GetTime(day)
        resovle({ date })
    })
}
function HistroyRoute(dataList, map, minpx, mimangle, allpoint, historypointLayerId, historylineLayerId) {
    //显示轨迹
    const showhistory = new addhistorymethods(historypointLayerId, historylineLayerId, map)
    showhistory.addhistory(dataList, map, minpx, mimangle, allpoint)
}

export default {
    HistroyTime,
    HistroyRoute
}