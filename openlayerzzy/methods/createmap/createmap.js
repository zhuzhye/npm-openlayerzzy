import Map from "ol/Map"; //地图
import View from "ol/View"; // 地图视图
import { transform, transformExtent } from "ol/proj"; //坐标系转换

// 基础地图 卫星图 天地图

const MapView = new Object({
  projection: "EPSG:3857", //使用这个坐标系
  center: transform([0, 0], "EPSG:4326", "EPSG:3857"), //定义中心位置
  zoom: 1, //定义等级
  minZoom: 1, //最小等级
  maxZoom: 20, //最大等级
  constrainResolution: true,//如果为 true，则视图将始终在交互后以最接近的缩放级别进行动画处理；false 表示允许中间缩放级别
  smoothExtentConstraint: false, //如果为真，分辨率的最小值/最大值将被平滑地应用，即允许视图略微超过给定的分辨率或缩放范围。
  // extent: transformExtent([-540, -85, 540, 85], "EPSG:4326", "EPSG:3857")
})

const MapProperty = new Object({
  target: "map",
  layers: [],
  view: null,
  overlays: [],
  controls: []
})

//创建地图
function CreateMap(map = MapProperty, view = MapView) {
  if (view.hasOwnProperty('center')) {
    view.center = transform(view.center, "EPSG:4326", "EPSG:3857")
  }
  if (view.hasOwnProperty('extent')) {
    view.extent = transformExtent(view.extent, "EPSG:4326", "EPSG:3857")
  }
  //抽取layers
  if (map.hasOwnProperty('layers')) {
    map.layers = Object.values(map.layers)
  }
  Object.assign(MapView, view)
  Object.assign(MapProperty, map);
  MapProperty.view = new View(MapView)
  return new Map(MapProperty);
}

export default {
  CreateMap,
};
