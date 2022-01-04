<template>
  <div>
    <div id="shipMes" v-move :style="{ left: '13px' }" v-show="ismadol">
      <div class="top" style="font-size: 18px">
        船名：{{ shipMes.name }}
        <span
          v-show="shipMes.isPos == 0 || shipMes.isPos == -1"
          style="color: #ffe51c"
        >
          {{
            shipMes.isPos == -1
              ? "暂无权限"
              : shipMes.isPos == 0
              ? "暂无船位"
              : ""
          }}
        </span>
        <span class="el-icon-close close_class" @click="closeinformation">
        </span>
      </div>
      <table
        width="90%"
        cellpadding="0"
        cellspacing="0"
        style="margin-left: 5%; margin-top: 10px"
      >
        <tbody style="">
          <tr class="theTr">
            <td style="padding-left: 20px">
              MMSI : <span>{{ shipMes.mmsi }}</span>
            </td>
            <td>
              类型 : <span>{{ shipMes.shipTypeStr }}</span>
            </td>
          </tr>
          <tr class="theTr">
            <td style="padding-left: 20px">
              IMO : <span>{{ shipMes.imo }}</span>
            </td>
            <td>
              船宽 : <span>{{ shipMes.width }}米</span>
            </td>
          </tr>
          <tr class="theTr">
            <td style="padding-left: 20px">
              呼号 : <span>{{ shipMes.callsign }}</span>
            </td>
            <td>
              船长 : <span>{{ shipMes.length }}米</span>
            </td>
          </tr>
        </tbody>
        <tr style="background-color: white; height: 10px"></tr>
        <tbody style="">
          <tr class="theTr">
            <td style="padding-left: 20px">
              纬度 :
              <span>
                {{
                  shipMes.posVo
                    ? MapApi.CacuLonLat(
                        shipMes.posVo.lat / 60 / 10000,
                        "lat",
                        "String"
                      )
                    : ""
                }}
              </span>
            </td>
            <td>
              经度 :
              <span>
                {{
                  shipMes.posVo
                    ? MapApi.CacuLonLat(
                        shipMes.posVo.lon / 60 / 10000,
                        "lon",
                        "String"
                      )
                    : ""
                }}
              </span>
            </td>
          </tr>
          <tr class="theTr">
            <td style="padding-left: 20px">
              航速 :
              <span>
                {{
                  shipMes.posVo && shipMes.posVo.sp ? shipMes.posVo.sp / 10 : 0
                }}
                节
              </span>
            </td>
            <td>
              航向 :
              <span>
                {{
                  shipMes.posVo && shipMes.posVo.co ? shipMes.posVo.co / 10 : 0
                }}
                度
              </span>
            </td>
          </tr>
          <tr class="theTr">
            <td style="padding-left: 20px">
              报位类型 :
              <span>{{ shipMes.posVo ? shipMes.posVo.tp : "" }}</span>
            </td>
            <td>
              设备类型 :
              <span>{{ shipMes.posVo ? shipMes.posVo.ct : "" }}</span>
            </td>
          </tr>
          <tr class="theTr">
            <td colspan="2" style="padding-left: 20px">
              报位时间 :
              <span>{{ shipMes.posVo ? shipMes.posVo.pt : "" }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btnDiv">
        <span class="btnDivItem Butcursor" @click="hisType()" v-if="histroybtn">
          轨迹
        </span>
        <div class="btnHis" v-show="isShowTime" style="border-radius: 13px">
          <div class="btnHisTop">
            历史轨迹
            <span
              class="el-icon-close close_class"
              style="
                color: rgb(0, 131, 204);
                top: 6px;
                right: 10px;
                font-size: 17px;
                font-weight: 700;
                display: inline-block;
                width: 17px;
                padding: 0;
              "
              @click="isShowTime = false"
              >&#xe63e;</span
            >
          </div>
          <el-row>
            <el-col :span="12">
              <div class="grid-content">
                <el-date-picker
                  v-model="startTime"
                  type="datetime"
                  placeholder="选择开始日期时间"
                >
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-date-picker
                  v-model="endTime"
                  type="datetime"
                  placeholder="选择结束日期时间"
                >
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
          <el-checkbox-group v-model="XLS.checkList" style="padding: 3px 16px">
            <el-checkbox label="3" :disabled="!XLS.disabledList.includes('3')">
              平台
            </el-checkbox>
            <el-checkbox label="6" :disabled="!XLS.disabledList.includes('6')">
              渔捞系统
            </el-checkbox>
            <el-checkbox label="9" :disabled="!XLS.disabledList.includes('9')">
              AIS
            </el-checkbox>
          </el-checkbox-group>
          <div class="btnHisBtn Butcursor">
            <div @click="findHistory('')">查询</div>
            <div @click="findHistory('seven')">一周</div>
            <div @click="findHistory('three')">三天</div>
            <div @click="findHistory('one')">一天</div>
          </div>
        </div>
      </div>
    </div>
    <historyinformation
      :historylist="historydata"
      :shipObj="shipObj"
      ref="historyinformation"
      @deletePath="deletePath"
      @setposition="setposition"
    ></historyinformation>
  </div>
</template>
<script>
import historyinformation from "./historyinformation.vue";
export default {
  props: {
    shipMes: {
      type: Object,
      default: () => {},
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    map: {
      type: Object,
      default: () => {},
    },
    historydata: {
      type: Array,
      default: () => [],
    },
    MapApi: {
      type: Object,
      default: null,
    },
  },
  components: {
    historyinformation,
  },
  data() {
    return {
      XLS: {
        show: false,
        checkList: [],
        disabledList: [],
      },
      startTime: null,
      endTime: null,
      shiphistoryShow: false,
      isShowTime: false,
      histroybtn: true,
      shipObj: {},
    };
  },
  computed: {
    ismadol: {
      get() {
        return this.isShow;
      },
      set(e) {
        if (!e) {
          this.isShowTime = false;
          this.startTime = null;
          this.endTime = null;
        }
        this.$emit("update:isShow", e);
      },
    },
    newhistorydata: {
      get() {
        return this.historydata;
      },
      set(e) {
        this.$emit("update:historydata", e);
      },
    },
  },
  updated() {
    // this.histroybtn = this.$router.history.current.meta.historybtn;
  },
  methods: {
    //历史轨迹方法---
    async findHistory(day) {
      //隐藏地图上的所需隐藏的船舶减轻轨迹渲染压力
      if (this.MapApi.GetLayersById(this.map, "ShipGroupLayer")) {
        this.MapApi.GetLayersById(this.map, "ShipGroupLayer").setVisible(false);
      }
      if (this.MapApi.GetLayersById(this.map, "ShipGroupLayer")) {
        this.MapApi.GetLayersById(this.map, "ShipGroupLayer").setVisible(false);
      }
      //对时间输入框赋值
      let that = this;
      await this.MapApi.HistroyTime(day).then((res) => {
        [this.startTime, this.endTime] = res.date;
        this.shipObj.startTime = this.startTime;
        this.shipObj.endTime = this.endTime;
        this.shipObj.shipName = this.shipMes.name;
        this.shipObj.shipId = this.shipMes.id;
      });
      //请求轨迹
      await (function () {
        that.$refs.historyinformation.loading = false;
        that.$refs.historyinformation.isShow = true;
        that.$http
          .get("/chart/posShipHis/queryBySource", {
            params: {
              startTime: that.startTime,
              endTime: that.endTime,
              vehicleId: that.shipMes.id,
              // source:"3,6,9"
            },
          })
          .then((res) => {
            if (res.data.code == 200) {
              console.log(res)
              res.data.result.forEach((item) => {
                item.lonStr = that.MapApi.CacuLonLat(
                  item.lon / 60 / 10000,
                  "lon",
                  "String"
                );
                item.latStr = that.MapApi.CacuLonLat(
                  item.lat / 60 / 10000,
                  "lat",
                  "String"
                );
              });
              that.newhistorydata = res.data.result;
              that.$refs.historyinformation.loading = false;
              let zoom = that.map.getView().getZoom();
              that.$nextTick(() => {
                that.MapApi.VariationHistory(zoom, that.historyroute);
              });
            }
          });
      })();
    },
    //定位
    setposition(position) {
      this.MapApi.SetPosition(this.map, position);
      let f = this.MapApi.CreatePoint(position);
      this.MapApi.GetLayersById(this.map, "ShipSelectKuang")
        .getSource()
        .addFeature(f);
    },
    //历史轨迹调用方法
    historyroute(minpx, mimangle, showtype) {
      this.MapApi.HistroyRoute(
        this.newhistorydata,
        this.map,
        minpx,
        mimangle,
        showtype,
        "ShipHistoryPointLayer",
        "ShipHistoryLineLayer"
      );
    },
    //---历史轨迹方法
    closeinformation() {
      this.ismadol = false;
    },
    hisType() {
      this.isShowTime = !this.isShowTime;
    },
    //清理轨迹
    deletePath() {
      this.MapApi.GetLayersById(this.map, "ShipHistoryPointLayer")
        .getSource()
        .clear();
      this.MapApi.GetLayersById(this.map, "ShipHistoryLineLayer")
        .getSource()
        .clear();
      this.MapApi.GetLayersById(this.map, "ShipSelectKuang")
        .getSource()
        .clear();
      this.MapApi.GetLayersById(this.map, "ShipGroupLayer").setVisible(true);
      this.newhistorydata = [];
    },
  },
};
</script>

<style lang="less" scoped>
#shipMes {
  position: fixed;
  top: 125px;
  width: 360px;
  height: 340px;
  background: linear-gradient(180deg, rgb(240, 247, 254) 20%, #fff);
  z-index: 120;
  border-radius: 11px;
  box-shadow: 0px 0px 4px 1px #333333b3;
}
#shipMes {
  .el-date-editor.el-input {
    width: 160px;
  }
}

#shipMes {
  .el-color-picker__trigger {
    height: 30px;
  }
}

#shipMes {
  .el-input__inner {
    height: 30px;
  }
}

#shipMes {
  .el-input__icon {
    line-height: 32px;
  }
}

.top {
  height: 40px;
  padding-left: 24px;
  font-size: 14px;
  color: #fff;
  line-height: 40px;
  font-weight: bold;
  background-color: #0091ea;
}

.theTr {
  height: 30px;
  width: 100%;
  font-size: 12px;
  color: #758692;
}

.theTr td {
  height: auto;
  padding: 0;
  border: none;
  width: 50%;
}

.theTr td span {
  color: #2b2b2b;
  font-weight: 400;
}

.btnDiv {
  width: 100%;
  height: 32px;
  display: flex;
  margin-top: 15px;
  /*justify-content: center;*/
  justify-content: left;
  padding-left: 16px;
  align-items: center;
}

.btnDivItem {
  width: 80px;
  height: 30px;
  background: linear-gradient(180deg, #0091ea, #00d4df);
  color: white;
  margin-right: 10px;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
}

.iconClose {
  position: absolute;
  /*top: 0px;*/
  right: 10px;
  font-size: 20px;
}
.iconClose:hover {
  cursor: pointer;
}
.addColor {
  position: absolute;
  /*top: 0px;*/
  right: 50px;
  font-size: 20px;
}

.btnHis {
  position: absolute;
  width: 360px;
  height: 140px;
  background: white;
  -webkit-box-shadow: 0px 2px 7px 0px #333;
  box-shadow: 0px 2px 7px 0px #333;
  z-index: 101;
  bottom: -146px;
  border-radius: 5px;
  left: 0px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  text-align: center;
}

.btnHisTop {
  height: 30px;
  font-weight: Bold;
  line-height: 30px;
  color: #0091ea;
  font-size: 14px;
  padding-left: 24px;
}
.Butcursor {
  cursor: pointer;
}
.btnHisBtn {
  height: 30px;
  line-height: 30px;
}

.btnHisBtn div {
  float: right;
  height: 30px;
  width: 80px;
  text-align: center;
  line-height: 30px;
  color: white;
  background: linear-gradient(180deg, #0091ea, #00d4df);
  border-radius: 5px;
  margin-right: 7px;
  margin-top: 5px;
}

.remindTab span {
  font-size: 12px;
  color: #999;
  margin: 10px 10px;
}

.remindTab .click {
  font-size: 14px;
  font-weight: 700;
  color: #2770d4;
}

.btn {
  display: inline-block;
  border-radius: 2px;
}

.mr_10 {
  margin-right: 10px;
}

.blue_btn1 {
  border: 1px solid #2770d4;
  color: #2770d4;
  width: 108px;
  line-height: 28px;
}

.dateclass {
  min-width: 165px !important;
}
.pullbt {
  border: 1px solid #ccdbe5;
  height: 23px;
  line-height: 20px;
  position: absolute;
  right: 37px;
  top: 3px;
  padding: 0 10px;
  background: #ecf5fb;
  border-radius: 5px;
  color: #2770d4;
  cursor: pointer;
}
.pullbt:hover {
  border: 1px solid #0199e9;
}
.close_class {
  position: absolute;
  font-weight: 700;
  right: 13px;
  top: 11px;
}
.close_class:hover {
  cursor: pointer;
  transform: rotate(0deg);
  animation-name: exampleclose;
  animation-duration: 1s;
}

@keyframes exampleclose {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
