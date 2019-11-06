export function setGroupCode(value) {
  var arr = []
  if (value !== null && value !== undefined && value.length > 0) {
    // 分组code列子每三位一个 001001001002
    var levels = value.length / 3
    for (var i = 0; i < levels; i++) {
      var now = value.substring(0, (i + 1) * 3)
      arr.push(now)
    }
  }
  return arr
}

export function checkEmpty(val) {
  switch (typeof val) {
    case 'string':
      return val.replace(/^\s*/, '').replace(/\s*$/, '').length === 0
    case 'number':
      return val === 0
    case 'object':
      return val === null
    case 'array':
      return val.length === 0
    default:
      return true
  }
}

// 判断是否为json转json结构
export function toJson(value) {
  if (value !== null && value !== undefined && value !== 'null') {
    try {
      var json = JSON.parse(value)
      return json
    } catch (exception) {
      return value
    }
  } else {
    return ''
  }
}
