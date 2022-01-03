const queryBySource = require("./data/queryBySourcedata")
function ship(methods, options, res) {
    let result = queryBySource
    switch (methods) {
        case 'GET':
            res.status(200).send(result)
            break;
        default:
            result = null
    }
    return res
}

module.exports = ship