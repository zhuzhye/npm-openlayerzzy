<template>
  <div
    id="historyMes"
    :style="{ left: '425px' }"
    v-show="isShow"
    v-move
    :class="showMes ? 'pack' : 'unfold'"
  >
    <div class="top">
      {{ shipObj.shipName }}
      <!-- <span class="iconfont iconClose" style="cursor: pointer"
        ><a-icon type="close-square"
      /></span> -->
      <span
        class="iconfont iconClose"
        style="cursor: pointer"
        @click="
          () => {
            $emit('deletePath'), (isShow = false);
          }
        "
      >
        <span class="el-icon-close close_class" style="cursor: pointer"></span>
      </span>
      <span class="iconAll" @click="changeState()"
        ><span
          style="
            cursor: pointer;
            font-size: 12px;
            position: relative;
            top: -4px;
          "
          >{{ zZ ? "展开" : "收起" }}</span
        >
        <i v-show="!zZ" class="el-icon-caret-top"></i>
        <i v-show="zZ" class="el-icon-caret-bottom"></i>
      </span>
    </div>
    <div class="next" v-show="showMes">
      <span
        >起始时间:<strong>{{ shipObj.startTime }}</strong></span
      >
      <span
        >终止时间:<strong>{{ shipObj.endTime }}</strong></span
      >
      <span
        >航迹数：<strong>{{ historylist.length }}</strong></span
      >
      <span
        >时间：{{ dayDay(shipObj.startTime, shipObj.endTime) }}<strong></strong
      ></span>
    </div>
    <div class="content" v-show="showMes" v-loading="loading">
      <ul class="ulTop">
        <li class="itemX">序列</li>
        <li class="item1">时间</li>
        <li class="item3">纬度</li>
        <li class="item2">经度</li>
        <li class="item4">航速(节)</li>
        <li class="item5">航向(度)</li>
        <li style="width: 110px">设备类型</li>
      </ul>
      <div class="ulDivFather">
        <template v-for="(item, index) in historylist">
          <ul
            :class="selectclass == index ? 'ulList ulListbg' : 'ulList'"
            :key="index"
            @click="setposition(item)"
          >
            <li class="itemX">{{ index + 1 }}</li>
            <li class="item1">{{ item.pt }}</li>
            <li class="item2">{{ item.latStr }}</li>
            <li class="item3">{{ item.lonStr }}</li>
            <li class="item4">{{ item.sp / 10 }}</li>
            <li class="item5">{{ item.co / 10 }}</li>
            <!-- <li class="item6">{{ item.ct }}</li> -->
            <li class="item6">AIS</li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "historyMes",
  props: {
    historylist: {
      type: Array,
      default: () => [],
    },
    shipObj: {
      type: Object,
      default: () => {},
    },
    map: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      index: 0,
      historyPoint: [], //轨迹点
      historyPoint_show: false, //是否刷新轨迹点
      isShow: false,
      selectclass: null, //选中颜色
      zZ: false,
      showMes: true,
      spinning: false,
      hisList: [],
      loading: false,
    };
  },
  mounted() {},
  watch: {},
  methods: {
    dayDay(start, end) {
      return (
        Math.ceil(
          (new Date(end).getTime() - new Date(start).getTime()) / 3600000
        ) + "小时"
      );
    },
    //定位
    setposition(datalist) {
      this.$emit("setposition", { lon: datalist.lon, lat: datalist.lat });
    },
    changeState() {
      this.zZ = !this.zZ;
      this.showMes = !this.showMes;
    },
  },
};
</script>

<style scoped>
.unfold {
  width: 250px;
}
.pack {
  width: 697px;
}
#historyMes {
  height: auto;
  background-color: white;
  position: absolute;
  top: 0px;
  z-index: 110;
  border-radius: 10px;
  font-size: 12px;
}
.top {
  height: 40px;
  padding-left: 20px;
  background-color: #e5f4fd;
  color: #0091ea;
  line-height: 40px;
  border-radius: 10px 10px 0 0;
}
.next {
  position: relative;
  height: 40px;
  line-height: 40px;
  color: rgb(49, 46, 46);
}
.next span {
  padding: 6px 14px;
}
.next span strong {
  color: #0091ea;
  font-weight: normal;
  padding-left: 6px;
}
.next > div {
  position: absolute;
  /* right: 150px; */
  width: 100%;
  height: 160px;
  background-color: #d4efff;
  z-index: 99;
}
.next > div > span {
  font-size: 20px;
}
.content {
  width: 100%;
  /*height: 40px;*/
}
.ulTop,
.ulList {
  padding-left: 0px;
  list-style: none;
  height: 40px;
  margin-bottom: 0;
}
.ulListbg {
  background: #e5f4fd;
}
.ulList:hover {
  background: #e5f4fd;
  cursor: pointer;
}
.ulTop li,
.ulList li {
  height: 40px;
  float: left;
  text-align: center;
  line-height: 40px;
}
.ulTop li {
  background-color: #e5f4fd;
  color: #0091ea;
  font-size: 16px;
}
.itemX {
  width: 60px;
}
.item1 {
  width: 160px;
}
.item2 {
  width: 90px;
}
.item3 {
  width: 90px;
}
.item4 {
  width: 74px;
}
.item5 {
  width: 112px;
}
.item6 {
  width: 90px;
}

.iconClose {
  position: absolute;
  top: 0px;
  right: 10px;
  font-size: 20px;
}
.iconAll {
  position: absolute;
  top: 0px;
  right: 40px;
  font-size: 20px;
}
.daochu {
  float: right;
  margin-right: 100px;
  display: inline-block;
  background-color: #aedefd;
  height: 30px;
  width: 50px;
  text-align: center;
  border-radius: 12px;
  line-height: 30px;
  margin-top: 5px;
  cursor: pointer;
  /* color: #fff; */
}
.ulDivFather {
  width: 100%;
  max-height: 260px;
  overflow: scroll;
  overflow-x: hidden;
  color: #000;
}
/*.ulDivFather::-webkit-scrollbar {display:none}*/
.ulDivFather::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.ulDivFather::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
.ulDivFather::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
</style>
