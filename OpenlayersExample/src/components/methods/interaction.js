const interaction = {
  data() {
    return {
      mouselisten: false
    }
  },
  methods: {
    //左下角坐标
    MouseListen() {
      this.mouselisten = !this.mouselisten;
      if (this.mouselisten) {
        this.MapApi.ListenMousePosition(this.map, "MouseListen", "mousePosition");
      } else {
        this.map.removeControl(this.MapApi.GetContorlById(this.map, 'MouseListen'));
      }
    }
  }
}
export default interaction