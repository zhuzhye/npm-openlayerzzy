const queryFocusPosByUserdata = require("./data/queryFocusPosByUserdata")
function ship(methods, options, res) {
  let result = queryFocusPosByUserdata
  switch (methods) {
    case 'GET':
      if (options.source == '3,6,9') {
        res.status(200).send(result)
      }
      break;
    default:
      result = null
  }
  return res
}

module.exports = ship