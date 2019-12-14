/* eslint-disable no-eval */
/**
 * @Author: wenqiz
 * @Date:   2019-03-12
 */
'use strict'
export default function addNodes(dataAll, dataCurrent, level) {
  let s
  // level为1是兄弟节点，level为0是子节点
  var n = dataCurrent._level - level

  var result = 'dataAll'
  if (level === 0) {
    s = new Array(n).join('.parent')
  } else if (level === 1) {
    s = new Array(n + 1).join('.parent')
  }

  s = 'dataCurrent' + s
  for (var i = 0; i < n; i++) {
    var keyName = eval(s).keyName
    var cdata = eval(result)
    for (var j = 0; j < cdata.length; j++) {
      console.log('cdata', cdata)
      if (cdata[j].keyName === keyName) {
        result = result + `[${j}].objectNodes`
        s = s.slice(0, (s.length - 7))
        break
      }
    }
  }
  if (eval(result) === null || eval(result) === undefined) {
    eval(result + ' = []')
  }
  if (level === 1) {
    eval(result + '.push({_level: dataCurrent._level,keyName: "",keyType: "STRING",required: false,widthPx: dataCurrent.widthPx,parent: dataCurrent.parent,remark: ""})')
  } else if (level === 0) {
    eval(result + '.push({_level: dataCurrent._level+1,keyName: "",keyType: "STRING",required: false,widthPx: dataCurrent.widthPx - 18,parent: dataCurrent,remark: ""})')
  }
  return dataAll
}
