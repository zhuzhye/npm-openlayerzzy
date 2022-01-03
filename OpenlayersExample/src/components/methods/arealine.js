import FHLine from "openlayerzzy/linedata/FH";
import SEELine from "openlayerzzy/linedata/SEE"
import ZXDline from "openlayerzzy/linedata/ZXDline"
import ZXDarea from "openlayerzzy/linedata/ZXDarea"
import JinYuQuarea from "openlayerzzy/linedata/JinYuQu"
import AGenTingLineDash from "openlayerzzy/linedata/argentinaWLLineDash"
import AGenTingLine from "openlayerzzy/linedata/argentinaWLLine"
const linemethods = {
  data(){
    return{
      EEZShow: true,
      FHShwow: false,
      SEEShwow: false,
      ZXDShwow:false,
      JinYuQuShow:false,
      AGenTingShow:false
    }
  },
  methods: {
    //EEZ
    EEZ() {
      this.EEZShow = !this.EEZShow;
      this.MapApi.GetLayersById(this.map, "EEZLayer").setVisible(this.EEZShow);
    },
    //凤凰保护区
    FH() {
      this.FHShwow = !this.FHShwow;
      if (this.FHShwow) {
        this.MapApi.AddAreaLine(this.map, "FHLayer", "Polygon", FHLine);
      } else {
        this.MapApi.ClearLayerById(this.map, "FHLayer");
      }
    },
    //塞舌尔禁渔区
    SSE() {
      this.SEEShwow = !this.SEEShwow;
      if (this.SEEShwow) {
        this.MapApi.AddAreaLine(this.map, 'SEELayer', "Polygon", SEELine);
      } else {
        this.MapApi.ClearLayerById(this.map, 'SEELayer');
      }
    },
    //中西、东太平洋重叠区,禁渔区
    ZXD(){
      this.ZXDShwow = !this.ZXDShwow;
      if (this.ZXDShwow) {
        this.MapApi.AddAreaLine(this.map, 'ZXDLayer', "Polygon", ZXDarea);
        this.MapApi.AddAreaLine(this.map, 'ZXDLayer', "LineString", ZXDline);
      } else {
        this.MapApi.ClearLayerById(this.map, 'ZXDLayer');
      }
    },
    //禁渔区
    JinYuQu(){
      this.JinYuQuShow = !this.JinYuQuShow;
      if (this.JinYuQuShow) {
        this.MapApi.AddAreaLine(this.map, 'JinYuQuLayer', "Polygon", JinYuQuarea);
      } else {
        this.MapApi.ClearLayerById(this.map, 'JinYuQuLayer');
      }
    },
    AGenTing(){
      this.AGenTingShow = !this.AGenTingShow;
      if (this.AGenTingShow) {
        this.MapApi.AddAreaLine(this.map, 'AGenTingLayer', "LineStringDash", AGenTingLineDash);
        this.MapApi.AddAreaLine(this.map, 'AGenTingLayer', "LineString", AGenTingLine);
      } else {
        this.MapApi.ClearLayerById(this.map, 'AGenTingLayer');
      }
    }
  }
}
export default linemethods