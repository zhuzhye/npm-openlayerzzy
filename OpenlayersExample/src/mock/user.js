function user(methods, options, res) {
  let result = null
  switch (methods) {
    case 'POST':
      if (options.username == "zzy" && options.password == "123456") {
        result = { code: 200, message: "登录成功", result: { token: "zzy-openlayer", user: "zzy", password: "123456" }, success: true, timestamp: new Date().getTime() }
        res.status(200).send(result)
      } else {
        result = { code: 500, message: "用户名或密码错误", result: null, success: false, timestamp: new Date().getTime() }
        res.status(500).send(result)
      }
      break;
    default:
      result = null
  }
  return result
}

module.exports = user