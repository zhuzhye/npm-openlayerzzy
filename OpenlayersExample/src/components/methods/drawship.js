const drawship = {
  data() {
    return {
      isgroupship: false,
      isfocusship: false,
    };
  },
  mounted() {
    this.addInteraction();
  },
  methods: {
    /*
    参数一:map地图对象
    参数二:layer绘制船舶的图层 
    参数三:dataList船舶数据  
    参数四:DefiningFeature船舶元素自定义 
    参数五:addType是否删除该图层一渲染的船舶 
    参数六:id唯一值字段名
    */
    addgroupship() {
      this.isgroupship = !this.isgroupship;
      //可以加入自己的图层
      let layer = this.MapApi.GetLayersById(this.map, "ShipGroupLayer");
      if (this.isgroupship) {
        let param = {
          source: "3,6,9",
          type: "ship",
        };
        this.$http
          .get("chart/posCurrent/queryPosByUser", { params: param })
          .then((res) => {
            this.MapApi.DrawShip(
              this.map,
              layer,
              res.data.result,
              (e) => this.groupFeature(e, { type: "groupship" }),
              false
            );
            this.$store.commit("addship", res.data.result);
        
          });
      } else {
        layer && layer.getSource().clear();
        this.$store.commit("addship", []);
      }
    },
    //添加关注船
    addfocusship() {
      this.isfocusship = !this.isfocusship;
      let layer = this.MapApi.GetLayersById(this.map, "ShipFocusLayer");
      if (this.isfocusship) {
        let param = {
          source: "3,6,9",
          isFleet: false,
        };
        this.$http
          .get("chart/posCurrent/queryFocusPosByUser", { params: param })
          .then((res) => {
            this.MapApi.DrawShip(
              this.map,
              layer,
              res.data.result,
              (e) => this.groupFeature(e, { type: "focusship" }),
              false
            );
          });
      } else {
        layer && layer.getSource().clear();
      }
    },
    //定义元素内容
    groupFeature(data, self) {
      let feature = {
        shipType: data.shipType, //船舶类型 shipType：75为渔货船
        direction: data.posVo.co ? data.posVo.co / 10 : 0,
        lon: data.posVo.lon / 60 / 10000,
        lat: data.posVo.lat / 60 / 10000,
        speed: data.posVo.sp ? data.posVo.sp / 10 : 0,
        // tp: tpShip[data.posVo.tp],
        name: data.name,
        time: data.posVo.pt,
        mmsi: data.mmsi,
        show: true,
        aisType: data.posVo.aisType,
        color:
          data.posVo.tp == 9 && data.posVo.aisType == 1
            ? "gray"
            : self.type == "groupship"
              ? "rgb(163, 16, 255)"
              : "orange",
      };
      return Object.assign(feature, self);
    },

    //添加点击船舶交互
    addInteraction() {
      // featuretypeandlayer需要交互的图层  键名feature的type值例如船的类型为groupship船队船舶, 键值layer图层
      let featuretypeandlayer = {
        groupship: this.MapApi.GetLayersById(this.map, "ShipGroupLayer"),
        focusship: this.MapApi.GetLayersById(this.map, "ShipFocusLayer"),
      };
      // ShipFindLayer选中船舶绘制新的船舶的图层
      let selectdrawlayer = {
        findship: this.MapApi.GetLayersById(this.map, "ShipFindLayer"),
      };
      this.MapApi.InteractionSelect(
        this.map, //必传
        featuretypeandlayer, //必传
        this.featurevalue, //必传
        selectdrawlayer //必传
      );
    },
    //要素值
    featurevalue(f, layers) {
      /*
        source：3，6，9代表时船位监控上的用户权限，这里就默认设置成3，6，9表示用户得到所有权限可以查看所有船舶
        两种方式显示数据
          1.直接获取到地图上元素的值显示数据
          2.向后台请求拿到详细数据
          3.船位监控：向后台请求获取详细的船舶数据
          4.ais网格化：首次获取船舶时信息已经详细所以不需要请求后台 直接使用f.value_的值就能获取到船舶信息
      */
      //需要将最新的位置放入新的图层
      let layer = this.MapApi.GetLayersById(this.map, "ShipFindLayer");
      let param = {
        vehicleId: f.getId(),
        source: "3,6,9",
      };
      //添加选择框 如果是用了ais网格化的方式在地图上获取船舶则不用写以下代码--
      if (!f.getId()) {
        console.error("No feature corresponding to id found");
        return;
      } else {
        //选择框显示
        this.MapApi.SelectKuang(this.map, layers, f.getId(), f.get("type"));
      }
      layer.getSource().addFeature(f);
      //获取最新船舶位置
      this.$http
        .get("/chart/posCurrent/queryPosByVehicleId", { params: param })
        .then((res) => {
          if (res.data.code == 200) {
            this.$emit("update:shipMes", res.data.result);
            this.$emit("update:shipMesShow", true);
            // //添加选择框 如果是用了ais网格化的方式在地图上获取船舶则不用写以下代码--
            // this.MapApi.DrawShip(
            //   this.map,
            //   layer,
            //   [res.data.result],
            //   (e) => this.groupFeature(e, { type: f.get("type") }),
            //   false
            // );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
export default drawship;
