const queryPosByUserResponse = require("./data/queryPosByUserdata")
const queryPosByUserWebglResponse = require("./data/queryPosByUserwebgldata")
function ship(methods, options, res) {
  let result = null
  switch (methods) {
    case 'GET':
      if (options.source == '3,6,9', options.type == 'ship') {
        res.status(200).send(queryPosByUserResponse)
      }
      if (options.source == '3,6,9',options.type == 'webgl') {
        res.status(200).send(queryPosByUserResponse)
      }
      break;
    default:
      result = null
  }
  return res
}

module.exports = ship