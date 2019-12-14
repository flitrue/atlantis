'use strict'
import Vue from 'vue'
export default function arrayToTree(data, parent = null) {
  Array.from(data).forEach(function(record) {
    Vue.delete(record, 'widthPx')
    Vue.delete(record, '_level')
    // 如果有父元素
    if (parent) {
      Vue.delete(record, 'parent')
    }
    if (record.objectNodes && record.objectNodes.length > 0) {
      arrayToTree(record.objectNodes, record)
    }
  })
  return data
}
