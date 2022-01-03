const queryPosByVehicleIdResponse = require("./data/queryPosByVehicleIddata")
function data(methods, options, res) {
    let result = null
    switch (methods) {
        case 'GET':
            if (options.source == '3,6,9' && options.vehicleId) {
                result = queryPosByVehicleIdResponse.filter(e => {
                    return e.result.id == options.vehicleId
                })[0]
                res.status(200).send(result)
            }
            break;
        default:
            result = null
    }
    return result
}

module.exports = data