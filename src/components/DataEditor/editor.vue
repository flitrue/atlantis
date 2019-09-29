<template>
  <div ref="editor" style="height: 100px" />
</template>

<script>
import mockEditor from './mockEditor.js'
const ModeMap = {
  javascript: 'ace/mode/javascript',
  json: 'ace/mode/json',
  csv: 'ace/mode/text',
  text: 'ace/mode/text',
  xml: 'ace/mode/xml',
  html: 'ace/mode/html'
}

function deparseValue(str = '') {
  // 不填按 null 处理
  if (str === '') return null
  // 两个双引号按空字符串处理
  if (str === '""') return ''
  if (str === 'true') return true
  if (str === 'false') return false
  if (str && !isNaN(+str)) return +str
  return str
}

function parseValue(str = '') {
  if (str === '') return '""'
  if (str === null) return ''
  return str
}

function getMode(mode) {
  return ModeMap[mode] || ModeMap.text
}

function parseCsv(csv = []) {
  if (!_.isArray(csv) || !csv.length) return ''
  const keys = []
  const vals = []

  csv.forEach((item, i) => {
    const rowVals = []
    _.map(item, (val, key) => {
      if (i === 0) keys.push(key)
      rowVals.push(parseValue(val))
    })
    const rowValsStr = rowVals.join(',')
    vals.push(rowValsStr)
  })

  return `${keys.join(',')}\n${vals.join('\n')}`
}

function deparseCsv(str = '') {
  if (!_.isString(str)) return []
  const csv = []
  const [keysStr, ...valueStrs] = str.split('\n')
  const keys = keysStr.split(',')

  valueStrs.forEach((valueStr, i) => {
    // 空行当做全 null 处理
    if (valueStr === '') {
      _.times(keys.length, n => (valueStr += ','))
    }

    const values = valueStr.split(',')
    const row = {}
    values.forEach((value, i) => {
      const key = (keys[i] || '').trim()
      if (!key) return
      value = (value || '').trim()
      row[key] = deparseValue(value)
    })
    csv.push(row)
  })

  return csv
}

export default {
  props: {
    value: [Array, Object],
    mode: {
      type: String,
      default: 'csv'
    }
  },
  data() {
    return {
      editor: null,
      editorType: this.type
    }
  },
  watch: {
    mode(v) {
      this.editor.editor.setValue('')
      this.editor.editor.getSession().setMode(getMode(v))
    }
  },
  mounted() {
    this.editor = mockEditor({
      container: this.$refs.editor,
      data: this.parse(this.value),
      onChange: this.onChange,
      mode: getMode(this.mode)
    })
  },
  destroyed() {
    this.editor.editor.destroy()
  },
  methods: {
    parse(v) {
      if (this.mode === 'csv') {
        return parseCsv(v)
      } else {
        return v
      }
    },
    deparse(val) {
      val.error = ''

      if (val.format && val.format !== true) {
        val.error = val.format
      }

      if (this.mode === 'csv') {
        val.value = deparseCsv(val.text)
      } else if (this.mode === 'json') {
        val.value = val.jsonData
      }

      return val
    },
    onChange(v) {
      this.$emit('input', this.deparse(v))
    }
  }
}
</script>

<style>
.data-editor {
  position: relative;
}
.data-eidor-type {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
