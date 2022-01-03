import { transform } from "ol/proj"; //坐标系转换
function fifterData(data, map, __minPix, __minAngle,allpoint) {
    console.log(allpoint,"进入vacuate");
    console.log(__minPix);
    if(allpoint){
        return data
    }
    var re = [];
    if(data.length==0){
        return re
    }
    var start = data[0];
    re.push(start);
    // console.log(start.lon / 60 / 10000,start.lat / 60 / 10000);
    var it0 = transform(
        [Number(start.lon / 60 / 10000), Number(start.lat / 60 / 10000)],
        "EPSG:4326",
        "EPSG:3857"
    );
     
    for (var i = 1; i <= data.length - 2; i++) {
        var item = data[i];
        // console.log([item.lon / 60 / 10000, item.lat / 60 / 10000]);
        var it = transform(
            [Number(item.lon / 60 / 10000), Number(item.lat / 60 / 10000)],
            "EPSG:4326",
            "EPSG:3857"
        );
        var pix = map.getPixelFromCoordinate(it);
        var pix0 = map.getPixelFromCoordinate(it0);
        if (
            Math.abs(pix[0] - pix0[0]) > __minPix ||
            Math.abs(pix[1] - pix0[1]) > __minPix
        ) {
            // console.log("加入了re");
            re.push(item);
            it0 = it;
        } else {
            var s = it0;
            var c = it;
            var e = transform(
                [Number(data[i + 1].lon / 60 / 10000), Number(data[i + 1].lat / 60 / 10000)],
                "EPSG:4326",
                "EPSG:3857"
            );
            var dx1 = c[0] - s[0];
            var dy1 = c[1] - s[1];
            var r1 = Math.atan2(dy1, dx1);
            var dx2 = e[0] - c[0];
            var dy2 = e[1] - c[1];
            var r2 = Math.atan2(dy2, dx2);
            var angle = Math.abs(r2 - r1);
            var jd = (180 / Math.PI) * angle;
            if (jd > __minAngle) {
                re.push(item);
                it0 = it;
            }
        }
    }
    re.push(data[data.length - 1]);
    // console.log(re);
    return re;
}
export default fifterData
