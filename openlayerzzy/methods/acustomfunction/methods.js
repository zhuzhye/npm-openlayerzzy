import { transform } from "ol/proj";
import { Point } from "ol/geom";
import Feature from 'ol/Feature';
//通过id获取图层 传入map对象，图层id值
function GetLayersById(map, LayerId) {
    try {
        let Layer = map
            .getLayers()
            .getArray()
            .filter((e) => {
                return e.get("layerId") == LayerId;
            })[0];
        if (Layer) {
            return Layer
        } else {
            throw new Error('The layer was not found')
        }
    } catch (e) {
        console.error(e);
    }

}
//通过className获取图层 传入map对象， 图层的className
function GetLayerByClassName(map, LayerClassName) {
    try {
        let Layer = map.getLayers().getArray().filter(e => {
            return e.getClassName() == LayerClassName
        })[0]
        if (Layer) {
            return Layer
        } else {
            throw new Error('The layer was not found')
        }
    } catch (e) {
        console.error(e);
    }
}
//通过id查找control
function GetContorlById(map, controlId) {
    try {
        let control = map.getControls().getArray().filter(e => {
            return e.get('controlId') == controlId
        })[0]
        if (control) {
            return control
        } else {
            throw new Error('The control was not found')
        }
    } catch (e) {
        console.error(e);
    }
}
//通过id删除图层 传入map对象，图层id值
function ClearLayerById(map, LayerId) {
    map.removeLayer(GetLayersById(map, LayerId))
}
//通过className删除图层  传入map对象， 图层的className
function ClearLayerByClassName(map, LayerId) {
    map.removeLayer(GetLayerByClassName(map, LayerId))
}
//坐标转换--
function CacuLonLat(num, dir, ty) {
    let degree = parseInt(num);
    let direction = null;
    if (dir == "lon") {
        if (num >= 0) {
            direction = "E";
        } else {
            direction = "W";
        }
    } else if (dir == "lat") {
        if (num >= 0) {
            direction = "N";
        } else {
            direction = "S";
        }
    }
    var min = ((num - degree) * 60).toFixed(3);
    degree = Math.abs(degree);
    min = Math.abs(min);

    var array = [degree + "°" + min + "′", direction]; //这个得到的是方向 度 分 秒
    if (ty == 'String') {
        return degree + "°" + min + "′" + direction;
    } else {
        return [degree, min, direction];
    }
}
//监听地图图层--
function AddZoomListener(map, callback,) {
    return map.on("moveend", function (e) {
        var zoom = map.getView().getZoom(); //获取当前地图的缩放级别
        callback(zoom);
    });
};
//--监听地图图层
//不同层级轨迹抽稀参数调整--
function VariationHistory(zoom, callback) {
    if (zoom <= 3) {
        callback(50, 360, false);
    } else if (zoom > 5 && zoom < 7) {
        callback(50, 270, false);
    } else if (zoom > 7 && zoom < 9) {
        callback(50, 180, false);
    } else if (zoom > 9 && zoom < 11) {
        callback(50, 90, false);
    } else if (zoom > 11 && zoom < 13) {
        callback(50, 30, false);
    } else if (zoom > 13 && zoom < 15) {
        callback(50, 10, false);
    } else {
        callback(null, null, true);
    }
}
//--不同层级轨迹抽稀参数调整

//定位坐标 转化成3857坐标系--
function SetPosition(map, location, zoomexpansion = true) {
    let position = transform([location.lon / 60 / 10000, location.lat / 60 / 10000], 'EPSG:4326', 'EPSG:3857');
    map.getView().setCenter(position)
    if (zoomexpansion) {
        map.getView().setZoom(16)
    }
}
//--定位坐标

//创建点--
function CreatePoint(location) {
    let position = transform([location.lon / 60 / 10000, location.lat / 60 / 10000], 'EPSG:4326', 'EPSG:3857');
    let point = new Point(position);
    return new Feature({
        geometry: point,
    });
}
//--创建点
export default {
    GetLayersById,
    GetLayerByClassName,
    ClearLayerById,
    ClearLayerByClassName,
    GetContorlById,
    CacuLonLat,
    AddZoomListener,
    VariationHistory,
    SetPosition,
    CreatePoint
}
