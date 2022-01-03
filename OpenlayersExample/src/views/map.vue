<template>
  <div id="map">
    <!-- 左下角坐标 -->
    <div id="mousePosition">
      25°34.575′ S
      <br />13°40.192′ W
    </div>
    <!-- 鼠标悬停时信息框 -->
    <div id="showmessage"></div>
    <div id="showhismessage"></div>
    <!-- 右下角小地图 -->
    <SmallMap :map="map" :AddSmallMap="AddSmallMap"></SmallMap>
    <div class="tools" @click="drawer = !drawer">
      <i class="el-icon-d-arrow-left"></i>
    </div>
    <!-- 菜单抽屉 -->
    <el-drawer title="地图方法" :visible.sync="drawer" size="50%">
      <Collpase
        v-bind="{ map, MapApi }"
        :shipMesShow.sync="shipMesShow"
        :shipMes.sync="shipMes"
      ></Collpase>
    </el-drawer>
    <!-- 船舶信息框 -->
    <Information
      :shipMes.sync="shipMes"
      :isShow.sync="shipMesShow"
      v-bind="{ map, MapApi }"
    ></Information>
  </div>
</template>
<script>
import MapApi from "openlayerzzy/methods/index";
import SmallMap from "../components/smallmap.vue";
import Collpase from "../components/collapse.vue";
import Information from "../components/imformation.vue";
export default {
  components: {
    SmallMap,
    Collpase,
    Information,
  },
  data() {
    return {
      map: null, //用户自己创建的地图
      MapApi, //地图方法
      layers: MapApi.Layers, //我的api中的内置图层
      AddSmallMap: [
        //   图层名             图片名
        // { LandLayer: "地图", urlname: "ditu" },
      ],
      drawer: false, //菜单抽屉
      shipMesShow: false, //船舶信息
      shipMes: {}, //船舶信息
    };
  },
  methods: {
    //创建新地图
    CreateNewMap() {
      const map = {
        //初始化定义的图层可以放入多个属性
        layers: this.layers,
      };
      this.map = this.MapApi.CreateMap(map);
    },
    //添加鼠标移入事件
    Customelement(f, value) {
      // return "时间：" + f.get("time") + "<br/>";
      return "";
    },
  },
  mounted() {
    //创建地图
    this.$nextTick(() => {
      this.CreateNewMap();
      //鼠标移入事件显示船舶信息或者历史轨迹信息
      this.MapApi.MouseMethods(this.map, (f) => this.Customelement(f));
    });
  },
  watch: {
    //关闭弹框时注意清理选择框和选中图层船舶
    shipMesShow(newval) {
      if (!newval) {
         this.MapApi.GetLayersById(this.map, "ShipFindLayer").getSource().clear();
         this.MapApi.GetLayersById(this.map, "ShipSelectKuang").getSource().clear();
      }
    },
  },
};
</script>

<style lang="less" scoped>
#map {
  width: 100%;
  height: calc(100vh - 20px);
}
#mousePosition {
  position: absolute;
  bottom: 15px;
  z-index: 2;
  width: 110px;
  left: 10px;
  padding: 6px;
  color: white;
  border: 1px solid #c7c7c7;
  border-radius: 5px;
  font-size: 1em;
  text-decoration: none;
  text-align: right;
  background-color: rgba(0, 0, 0, 0.4);
}
.tools {
  position: absolute;
  z-index: 99;
  top: 50%;
  right: 9px;
  transform: translateY(-50%);
  height: 50px;
  background: #74b1ff;
  width: 20px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  cursor: pointer;
}
.el-icon-d-arrow-left {
  color: white;
  line-height: 50px;
}
#map {
  /deep/ .ol-tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
    font-size: 12px;
  }
  /deep/ .ol-tooltip-measure {
    opacity: 1;
    font-weight: bold;
  }
  /deep/.ol-tooltip-static {
    background-color: #ff5500;
    color: white;
    font-size: 14px;
    font-weight: bold;
    border: 1px solid white;
  }
  /deep/ .ol-tooltip-measure:before,
  /deep/ .ol-tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: "";
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
  }
  /deep/.ol-tooltip-static:before {
    border-top-color: #ff5500;
  }
}
/*船信息 轨迹点信息显示样式*/
#showmessage {
  display: block;
  position: absolute;
  padding: 10px;
  background-color: white;
  opacity: 1;
  font-size: 12px;
  border-radius: 10px;
  text-align: left;
  color: #2b2b2b;
  white-space: nowrap;
}
</style>
