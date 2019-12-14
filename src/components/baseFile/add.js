/* eslint-disable no-eval */
/**
 * @Author: wenqiz
 * @Date:   2019-03-12
 */
'use strict'
export default function deleteNode(tmp, data) {
  var n = tmp._level
  var result = 'data'
  var s = new Array(n).join('.parent')
  s = 'tmp' + s
  for (var i = 0; i < n; i++) {
    var keyName = eval(s).keyName
    var cdata = eval(result)
    for (var j = 0; j < cdata.length; j++) {
      if (cdata[j].keyName === keyName) {
        result = result + `[${j}].objectNodes`
        s = s.slice(0, (s.length - 7))
        break
      }
    }
  }
  result = 'delete ' + result
  eval(result)
  return data
}
