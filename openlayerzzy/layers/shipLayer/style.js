import Style from "ol/style/Style"; //样式总类
import styleText from "ol/style/Text"; //添加文字标注
import styleFill from "ol/style/Fill"; //添加填充样式
import styleStroke from "ol/style/Stroke"; //添加填充样式
import Polygon from "ol/geom/Polygon"; //面
import { transform } from "ol/proj"; //坐标系转换
import styleIcon from "ol/style/Icon"; //添加图标
import kuang from "./image/kuang.png"
const ShipStyle = new Object({})
ShipStyle.ShipStyle = function (f, r) {
    let changeCoor = coor => transform(coor, "EPSG:4326", "EPSG:3857");
    let r1 = 0.0005; //r=0.0005代表着100米
    let style = null;
    let gemo = null;
    let speed = parseFloat(f.get("speed")) * 0.514444;
    let name = f.get("name");
    let color = f.get("color");
    let direction = parseFloat(f.get("direction"));
    let o = f.get("geom").getCoordinates();
    let lon = parseFloat(f.get("lon"));
    let lat = parseFloat(f.get("lat"));
    let shipType = f.get('shipType')
    let show = f.get("show")
    if (!show) {
        return
    }
    //判断图层级别
    if (r < 13) {
        style = new Style({
            fill: new styleFill({
                color: shipType == 75 ? '#398AD1' : color
            }),
            stroke: new styleStroke({
                color: "#333",
                width: 0.5
            })
        });
        //判断航向是不是O 是就显示方块
        let x = changeCoor([lon, lat + (1.8 + speed * 0.2) * r1]);
        let a1 = changeCoor([lon, lat + 1.8 * r1]);
        let b1 = changeCoor([lon - 0.4 * r1, lat + r1]);
        let c1 = changeCoor([lon + 0.4 * r1, lat + r1]);
        let d1 = changeCoor([lon - 0.4 * r1, lat - 1.5 * r1]);
        let e1 = changeCoor([lon + 0.4 * r1, lat - 1.5 * r1]);
        gemo = new Polygon([[x, a1, b1, d1, e1, c1, a1]]);
        gemo.rotate((-Math.PI / 180) * direction, o);
    } else {
        r1 = r / 13000;
        style = new Style({
            fill: new styleFill({
                color: shipType == 75 ? '#398AD1' : color
            }),
            stroke: new styleStroke({
                color: "#333",
                width: 1
            })
        });
        var r2 = r * 6.5
        if (shipType == 75) {
            var x = [o[0], o[1] + r * 17 + r2 * speed * 0.3]
            let a1 = changeCoor([lon, lat + 1.3 * r1]);
            let b0 = changeCoor([lon - 0.7 * r1, lat + 0.7 * r1]);
            let b1 = changeCoor([lon - 0.7 * r1, lat - r1]);
            let b2 = changeCoor([lon, lat - r1 * 0.4]);
            let c1 = changeCoor([lon + 0.7 * r1, lat - r1]);
            let c0 = changeCoor([lon + 0.7 * r1, lat + 0.7 * r1]);
            gemo = new Polygon([[x, a1, b0, b1, b2, c1, c0, a1]]);
            gemo.rotate((-Math.PI / 180) * direction, o);
        } else {
            var x = [o[0], o[1] + r * 17 + r2 * speed * 0.3]
            var a = [o[0], o[1] + r2 * 3];
            var b = [o[0] - r2, o[1] - r2];
            var c = [o[0] + r2, o[1] - r2];
            gemo = new Polygon([[x, a, b, c, a]]);
            gemo.rotate((-Math.PI / 180) * direction, o);
        }
    }
    f.setProperties({ geometry: gemo }, true)
    let nameStyle = new Style({
        text: new styleText({
            font: 'bold 12px serif',
            textAlign: "left",
            // placement	:'line',
            overflow: true,
            fill: new styleFill({
                color: 'rgb(90,90,90)'
            }),
            stroke: new styleStroke({
                color: "#fff",
                width: 2
            }),
            textBaseline: "bottom",
            offsetX: 0,
            offsetY: 30,
            text: name
        })
    });
    let styles = [];
    styles.push(style);
    styles.push(nameStyle);
    return styles
};
//选择框样式
ShipStyle.SelectStyle = new Style({
    image: new styleIcon({
        anchor: [0.5, 0.5],
        src: kuang
    })
});
export default ShipStyle