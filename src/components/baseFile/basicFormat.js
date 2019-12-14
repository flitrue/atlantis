'use strict'
import Vue from 'vue'
export default function treeToArray(data, parent = null, widthPx = null, level = null) {
  Array.from(data).forEach(function(record) {
    let _widthPx = 350
    if (widthPx !== undefined && widthPx !== null) {
      _widthPx = widthPx - 18
    }
    Vue.set(record, 'widthPx', _widthPx)

    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)

    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent)
    }
    if (record.objectNodes && record.objectNodes.length > 0) {
      treeToArray(record.objectNodes, record, _widthPx, _level)
    }
  })
  return data
}
