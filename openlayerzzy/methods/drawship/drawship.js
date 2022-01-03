import Feature from "ol/Feature"; //特点
import { Point } from "ol/geom";
import { transform } from "ol/proj"; //坐标系转换

//船位监控的船舶
class newship {
    constructor(map, layer, DefiningFeature=()=>{}, id) {
        this.map = map;
        this.Layer = layer;
        this.DefiningFeature = DefiningFeature;
        this.id = id
    }
    //添加船舶
    AddShip(dataList, addType = true) {
        if (addType) {
            this.Layer.getSource().clear();
        }
        dataList.forEach((item) => {
            this.replaceship(item)
            this.AddFn(item, addType);
        });
    }
    AddFn(data) {
        //必备参数 center (lon和lat 为 4326坐标系)
        let DF = this.DefiningFeature(data)
        let coor = transform(
            [DF.lon, DF.lat],
            "EPSG:4326",
            "EPSG:3857"
        );
        let geom = new Point(coor);
        let f = new Feature(
            Object.assign({ geometry: geom, center: coor }, DF)
        );
        data[this.id] && f.setId(data[this.id]);
        f.set("geom", geom);
        this.Layer.getSource().addFeature(f);
    }
    //更新船舶
    replaceship(item) {
        let f = this.Layer.getSource().getFeatureById(item[this.id])
        f && this.Layer.getSource().removeFeature(f)
    }
}
/*
    map地图对象
    layer绘制船舶的图层 
    dataList船舶数据  
    DefiningFeature船舶元素自定义 
    addType是否删除所有船舶 
    id唯一值字段名
*/
function DrawShip(map, layer, dataList, DefiningFeature, addType = false, id = "id",) {
    new newship(map, layer, DefiningFeature, id).AddShip(dataList, addType);
}
export default { DrawShip };
