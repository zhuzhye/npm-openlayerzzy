import { fromLonLat } from "ol/proj"; //坐标系转换
import { LineString, Polygon } from "ol/geom"; //线,多边形
import Feature from "ol/Feature"; //矢量对象
import SourceVector from "ol/source/Vector"; //资源
import Vector from "ol/layer/Vector"; //图层
import styleFill from "ol/style/Fill"; //添加填充样式
import styleStroke from "ol/style/Stroke"; //添加填充样式
import Style from "ol/style/Style"; //样式总类
//坐标转换成feature
function lineDataTrans(d, type) {
    let data = [];
    let d1 = d.split(",");
    for (let i1 in d1) {
        let d2 = d1[i1].split(" ");
        data.push({
            lon: Number(d2[0]),
            lat: Number(d2[1])
        });
    }
    data.map(function (item, index, arr) {
        if (index > 0) {
            if (item.lon - arr[index - 1].lon < -180) item.lon += 360;
            else if (item.lon - arr[index - 1].lon > 180) {
                let i = index - 1;
                while (i >= 0) {
                    arr[i--].lon += 360;
                }
            }
        }
    });
    let ar = [];
    data.forEach(function (item) {
        ar.push(fromLonLat([Number(item.lon), Number(item.lat)]));
    });
    let ls = null;
    if (type == "LineString") {
        ls = new LineString(ar);
    } else if (type == "Polygon") {
        ls = new Polygon([ar]);
    }else if(type == "LineStringDash"){
        ls = new LineString(ar);
    }
    let lsf = new Feature({
        geometry: ls
    });

    return lsf;
}
//样式选择
function StyleType(type) {
    let style = null
    switch (type) {
        case 'Polygon':
            style = new Style({
                fill: new styleFill({
                    color: "rgba(239,245,133, 0.5)"
                }),
                stroke: new styleStroke({
                    color: "#FF0000",
                    width: 1
                })
            });
            break;
        case 'LineString':
            style = new Style({
                stroke: new styleStroke({
                    color: "#FF5454",
                    width: 2
                })
            });
            break;
        case 'LineStringDash':
            style = new Style({
                stroke: new styleStroke({
                    color: "#FF5454",
                    lineDash: [10, 10],
                    width: 2
                })
            });
            break;
        default:
            break;
    }
    return style
}

function _isexist(map, LayerId) {
    let _isId = map.getLayers().getArray().filter((e) => {
        return e.get("layerId") == LayerId;
    })[0];
    let _isclassname = map.getLayers().getArray().filter(e => {
        return e.getClassName() == LayerId
    })[0]
    return _isId || _isclassname
}
/*
    参数1：map对象
    参数2：图层Id 或者 className
    参数3：类型 Polygon多边形 LineString线条
    参数4：数据源（所要画的坐标）
    参数5：图层层级
*/
function AddAreaLine(map, LayerId, LineType, LineData = null, zIndex = 20) {
    try {
        if (!_isexist(map, LayerId)) {
            if (LineType == 'Polygon' || LineType == "LineString" || LineType == "LineStringDash") {
                let source = new SourceVector()
                let Layer = new Vector({
                    source,
                    style: StyleType(LineType),
                    zIndex,
                    className: LayerId
                });
                if (Array.isArray(LineData)) {
                    LineData.forEach(item => {
                        console.log(item);
                        source.addFeature(lineDataTrans(item, LineType))
                    })
                } else {
                    source.addFeature(lineDataTrans(LineData, LineType))
                }
                Layer.set("layerId", LayerId)
                map.addLayer(Layer)
            } else {
                throw new Error("The type can only be Polygon or LineString or LineStringDash")
            }
        } else {
            try {
                if (LineData) {
                    let source = _isexist(map, LayerId).getSource()
                    if (Array.isArray(LineData)) {
                        LineData.forEach(item => {
                            let f = lineDataTrans(item, LineType)
                            f.setStyle(StyleType(LineType))
                            source.addFeature(f)
                        })
                    } else {
                        let f = lineDataTrans(item, LineType)
                        f.setStyle(StyleType(LineType))
                        source.addFeature(f)
                    }
                } else {
                    throw new Error(`No coordinates provided`)
                }
            } catch (e) {
                console.error(e);
            }
        }
    } catch (e) {
        console.error(e);
    }
}
export default { AddAreaLine }

