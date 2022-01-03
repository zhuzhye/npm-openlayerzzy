const stadiometry = {
  data() {
    return {
      scalelineshow: false,
      gridsshow:false
    }
  },
  methods: {
    //测距
    Measurement() {
      this.MapApi.Measurement(this.map, "DrawLineLayer");
    },
    //比例尺
    scaleline() {
      this.scalelineshow = !this.scalelineshow;
      if (this.scalelineshow) {
        this.MapApi.AddScaleLine(this.map, "ScaleLineContorl");
      } else {
        this.map.removeControl(
          this.MapApi.GetContorlById(this.map, "ScaleLineContorl")
        );
      }
    },
    //网格
    grid(){
      this.gridsshow = !this.gridsshow;
      this.MapApi.GetLayersById(this.map, 'GridsLayer').setVisible(this.gridsshow);
    }
  }
}
export default stadiometry