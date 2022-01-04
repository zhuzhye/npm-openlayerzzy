<template>
  <div style="padding: 0px 20px" @click="handleChange">
    <el-collapse>
      <el-collapse-item title="工具">
        <el-button id="Measurement" type="primary" plain>
          <span id="Measurement"> 测距 </span>
        </el-button>
        <el-button id="scaleline" type="primary" plain>
          <span id="scaleline">
            {{ scalelineshow ? "关闭比例尺" : "显示比例尺" }}
          </span>
        </el-button>
        <el-button id="grid" type="primary" plain>
          <span id="grid">
            {{ gridsshow ? "关闭网格" : "显示网格" }}
          </span>
        </el-button>
      </el-collapse-item>
      <el-collapse-item title="区域线">
        <el-button id="EEZ" type="primary" plain>
          <span id="EEZ">
            {{ EEZShow ? "关闭EEZ" : "打开EEZ" }}
          </span>
        </el-button>
        <el-button id="FH" type="primary" plain>
          <span id="FH">
            {{ FHShwow ? "清除凤凰保护区" : "添加凤凰保护区" }}
          </span>
        </el-button>
        <el-button id="SSE" type="primary" plain>
          <span id="SSE">
            {{ SEEShwow ? "清除塞舌尔禁渔区" : "添加塞舌尔禁渔区" }}
          </span>
        </el-button>
        <el-button id="ZXD" type="primary" plain>
          <span id="ZXD">
            {{
              ZXDShwow
                ? "清除中西、东太平洋重叠区,禁渔区"
                : "添加中西、东太平洋重叠区,禁渔区"
            }}
          </span>
        </el-button>
        <el-button id="JinYuQu" type="primary" plain>
          <span id="JinYuQu">
            {{ JinYuQuShow ? "清除禁渔区" : "添加禁渔区" }}
          </span>
        </el-button>
        <el-button id="AGenTing" type="primary" plain>
          <span id="AGenTing">
            {{ AGenTingShow ? "清除阿根廷警戒线" : "添加阿根廷警戒线" }}
          </span>
        </el-button>
      </el-collapse-item>
      <el-collapse-item title="地图交互">
        <el-button id="MouseListen" type="primary" plain>
          <span id="MouseListen">
            {{ mouselisten ? "取消鼠标位置监听" : "鼠标位置监听" }}
          </span>
        </el-button>
      </el-collapse-item>
      <el-collapse-item title="画船">
        <el-button id="addgroupship">
          <span id="addgroupship">
            {{ !isgroupship ? "添加船队船舶" : "移除船队船舶" }}
          </span>
        </el-button>
        <el-button id="addfocusship">
          <span id="addfocusship">
            {{ !isfocusship ? "添加关注船舶" : "移除关注船舶" }}
          </span>
        </el-button>
        <el-tree
          v-if="isgroupship"
          show-checkbox
          :data="$store.state.ships"
          :default-checked-keys="$store.getters.shipsId"
          :props="defaultProps"
          node-key="id"
          @check-change="checkchange"
          ref="shiptree"
        ></el-tree>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import arealine from "./methods/arealine";
import stadiometry from "./methods/stadiometry";
import interaction from "./methods/interaction";
import drawship from "./methods/drawship";
export default {
  mixins: [arealine, stadiometry, interaction, drawship],
  props: {
    MapApi: {
      type: Object,
      default: {},
    },
    map: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    handleChange(e) {
      if (this[e.target.id]) {
        this[e.target.id]();
      }
    },
    checkchange(data, checktype) {
      console.log(data, checktype);
      let layer = this.MapApi.GetLayersById(this.map, "ShipGroupLayer");
      let f = layer.getSource().getFeatureById(data.id);
      f && f.set("show", checktype);
      console.log(f);
    },
  },
};
</script>
<style scoped>
.el-tag {
  cursor: pointer;
}
</style>
