import 'ol/ol.css';
import styleFill from "ol/style/Fill"; //添加填充样式
import styleStroke from "ol/style/Stroke"; //添加填充样式
import { Circle as CircleStyle } from "ol/style";
import Style from "ol/style/Style"; //样式总类
const DrawStyle = new Object({});
//测距的样式
DrawStyle.MeasureStyle = new Style({
    fill: new styleFill({
        color: "rgba(255, 255, 255, 0.2)"
    }),
    stroke: new styleStroke({
        color: "#ff5500",
        width: 3
    }),
    image: new CircleStyle({
        radius: 7,
        fill: new styleFill({
            color: "#ff5500"
        })
    })
});
export default DrawStyle