import { ScaleLine } from 'ol/control';
import { MousePosition } from 'ol/control';
import MAP from "../index"
import { transform } from "ol/proj"; //坐标系转换
import 'ol/ol.css';
//比例尺--
function AddScaleLine(map, controlId) {
    try {
        let _isexists = map.getControls().getArray().filter(e => {
            return e.get('controlId') == controlId
        })[0]
        if (_isexists) {
            throw new Error("Scale already exists")
        } else {
            let ScaleLineControl = new ScaleLine();
            ScaleLineControl.set("controlId", controlId)
            //--比例尺
            map.addControl(ScaleLineControl)
        }
    } catch (e) {
        console.error(e);
    }
}
//--比例尺
//鼠标监听--
function ListenMousePosition(map, controlId,DOMId) {
    try{
        let _isexists = map.getControls().getArray().filter(e => {
            return e.get('controlId') == controlId
        })[0]
        if(!_isexists){
            let ListenMouse = new MousePosition({
                target: document.getElementById(DOMId),
                coordinateFormat: function (coor) {
                    var el = document.getElementById(DOMId);
                    var center = transform(coor, "EPSG:3857", "EPSG:4326");
                    var lon = MAP.CacuLonLat(center[0], 'lon', 'String');
                    var lat = MAP.CacuLonLat(center[1], 'lat', 'String');
                    el.innerHTML = lat + "<br/>" + lon;
                    return ""
                },
                projection: 'EPSG:3857',
            });
            ListenMouse.set("controlId", controlId)
            map.addControl(ListenMouse)
        }else{
            throw new Error('The control was not found')
        }
    }catch(e){
        console.error(e);
    }
}
//--鼠标监听

export default { AddScaleLine, ListenMousePosition }