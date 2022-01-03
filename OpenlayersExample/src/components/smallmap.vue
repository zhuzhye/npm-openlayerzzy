<template>
  <!-- 小地图 -->
  <div id="smallMap">
    <div
      v-for="(mapitem, index) of smallmap"
      :class="'smallMap' + (index + 1)"
      :key="index"
      :style="smallmapstyle(index, mapitem.urlname)"
      @click="ChangeMap(Object.keys(mapitem)[0])"
    >
      <span>{{ Object.values(mapitem)[0] }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    AddSmallMap: {
      type: Array,
      default: () => [],
    },
    map: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    smallmap() {
      return [...this.defaultmap, ...this.AddSmallMap];
    },
  },
  data() {
    return {
      //默认三个题图
      defaultmap: [
        { LandLayer: "地图", urlname: "ditu" },
        { SateLayer: "卫星图", urlname: "weixingtu" },
        { SeaLayer: "海图", urlname: "haitu" },
      ],
    };
  },
  methods: {
    smallmapstyle(index, urlname) {
      return {
        position: "absolute",
        top: 0,
        right: `${10 + index * 60}px`,
        zIndex: `${131 + index}px`,
        backgroundImage: "url(" + require(`./image/${urlname}.png`) + ")",
      };
    },
    //显示隐藏 切换地图 海图 卫星
    ChangeMap(LayerId) {
      console.log(LayerId);
      this.smallmap.forEach((e) => {
        if (Object.keys(e)[0] == LayerId) {
          this.GetLayersById(Object.keys(e)[0]).setVisible(true);
        } else {
          this.GetLayersById(Object.keys(e)[0]).setVisible(false);
        }
      });
    },
    //通过id获取图层
    GetLayersById(LayerId) {
      console.log(this.map.getLayers());

      return this.map
        .getLayers()
        .getArray()
        .filter((e) => {
          return e.get("layerId") == LayerId;
        })[0];
    },
  },
};
</script>
<style scoped>
#smallMap {
  position: absolute;
  width: 100px;
  height: 83px;
  bottom: 5px;
  right: 2px;
  z-index: 130;
}
#smallMap div {
  width: 90px;
  height: 70px;
  border-radius: 0 14px 0 14px;
  background-size: contain;
  background-position: center;
}
#smallMap div:hover {
  z-index: 140;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.5);
  transform: scale(1.2);
  transition: 0.4s all;
}
#smallMap span {
  position: absolute;
  width: 40px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  background-color: #0090e9;
  color: white;
  z-index: 134;
  bottom: 0px;
  right: 0px;
  font-size: 12px;
}
</style>