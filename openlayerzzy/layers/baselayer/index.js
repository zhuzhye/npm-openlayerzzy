import TileLayer from 'ol/layer/Tile';
import XYZ from "ol/source/XYZ";
import Group from "ol/layer/Group";
import 'ol/ol.css';
//可通过classname 或者时 id 获取layer 图层

//添加的图层
const BaseLayers = new Object({})

//海图--
BaseLayers.SeaLayer = new TileLayer({
    preload: Infinity, //预加载
    source: new XYZ({
        url: "http://haitu.intertion.cn/haitu/ImgService?z={z}&x={x}&y={y}",
    }),
    zIndex: 1,//图层层级
    className: 'SeaLayer',
});
BaseLayers.SeaLayer.set("layerId", 'SeaLayer')
//--海图

//地图--
BaseLayers.LandLayer = new Group({
    layers: [
        new TileLayer({
            source: new XYZ({
                crossOrigin: "anonymous",
                url:
                    "https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=32a5cea2cd257f71a7628814e873bd48"
            }),
            className: 'Landlayer',
        }),
        new TileLayer({
            source: new XYZ({
                crossOrigin: "anonymous",
                url:
                    "https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=32a5cea2cd257f71a7628814e873bd48"
            }),
            className: 'Landlayer',
      
        })
    ],
    zIndex: 1,
    visible:false
});
BaseLayers.LandLayer.set("layerId", 'LandLayer')
//--地图

//卫星图--
BaseLayers.SateLayer = new Group({
    layers: [
        new TileLayer({
            source: new XYZ({
                crossOrigin: "anonymous",
                url:
                    "https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=32a5cea2cd257f71a7628814e873bd48"
            }),
            className: "SateLayer",
        
        }),
        new TileLayer({
            source: new XYZ({
                crossOrigin: "anonymous",
                url:
                    "https://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=32a5cea2cd257f71a7628814e873bd48"
            }),
            className: "SateLayer",
            
        })
    ],
    zIndex: 1,
    visible:false
});
BaseLayers.SateLayer.set("layerId", 'SateLayer')
//--卫星图



export default BaseLayers