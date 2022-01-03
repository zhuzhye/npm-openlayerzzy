import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

//默认渲染的区域线
let AreaLineLayer = new Object({})
//用户控制渲染的区域线
let AreaLineLayerTs=new Object({})

//eez--
function padLeft(num, val) {
    return (new Array(num).join("0") + val).slice(-num);
};
AreaLineLayer.EezLayer = new TileLayer({
    preload: Infinity,
    source: new XYZ({
        cacheSize: 256,
        visible: true,
        tileUrlFunction: function (xyz) {
            if (!xyz) {
                return "";
            }
            let z = xyz[0];
            let x = Math.abs(xyz[1]);
            let y = -xyz[2] - 1;
            y += Math.pow(2, z);
            let tf = Math.pow(2, Math.ceil(z / 2) - 1);
            let tt = Math.pow(2, z);
            let t = tt / tf;
            let f1 = parseInt(x / t);
            let f2 = parseInt(y / t);
            let lev = padLeft(2, z);
            let folder = "0_0";
            if (z <= 5) {
                folder = f1 + "_" + f2;
            } else if (z >= 6 && z <= 11) {
                folder = padLeft(2, f1) + "_" + padLeft(2, f2);
            } else if (z >= 12 && z <= 17) {
                folder = padLeft(3, f1) + "_" + padLeft(3, f2);
            } else {
                folder = padLeft(4, f1) + "_" + padLeft(4, f2);
            }

            let xx, yy;
            if (z <= 5) {
                xx = padLeft(2, x);
                yy = padLeft(2, y);
            } else if (z >= 6 && z <= 11) {
                if (x == 100 || x == 1000) {
                    xx = padLeft(5, x);
                } else {
                    xx = padLeft(4, x);
                }

                if (y == 100 || y == 1000) {
                    yy = padLeft(5, y);
                } else {
                    yy = padLeft(4, y);
                }
            } else if (z >= 12 && z <= 17) {
                if (x == 100 || x == 1000 || x == 10000 || x == 100000) {
                    xx = padLeft(7, x);
                } else {
                    xx = padLeft(6, x);
                }

                if (y == 100 || y == 1000 || x == 10000 || x == 100000) {
                    yy = padLeft(7, y);
                } else {
                    yy = padLeft(6, y);
                }
            } else {
                if (
                    x == 100 ||
                    x == 1000 ||
                    x == 10000 ||
                    x == 100000 ||
                    x == 1000000 ||
                    x == 10000000
                ) {
                    xx = padLeft(9, x);
                } else {
                    xx = padLeft(8, x);
                }

                if (
                    y == 100 ||
                    y == 1000 ||
                    x == 10000 ||
                    x == 100000 ||
                    x == 1000000 ||
                    x == 10000000
                ) {
                    yy = padLeft(9, y);
                } else {
                    yy = padLeft(8, y);
                }
            }
            return (
                "http://47.93.90.52:18002" +
                "/EPSG_900913_" +
                lev +
                "/" +
                folder +
                "/" +
                xx +
                "_" +
                yy +
                ".png"
            );
            // return "http://47.93.90.52:9080" + "/EPSG_900913_" + lev + "/" + folder + "/" + xx + "_" + yy + ".png";
        }
    }),
    zIndex: 20
});
AreaLineLayer.EezLayer.set("layerId", "EEZLayer")
//--eez





export {AreaLineLayer,AreaLineLayerTs}
