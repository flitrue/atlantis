<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null,
      mySeries: null,
      myLegend: null
    }
  },
  watch: {
    chartData: {
      // deep: true,
      handler(val) {
        this.myLegend = val.legend
        this.mySeries = this.generateSeries(val.chartData)
        this.initChart()
      }
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    generateSeries(data) {
      const series = []
      if (data !== null && data !== undefined && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const nowdata = data[i]
          series.push({
            name: nowdata.dimension,
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: nowdata.dataList,
            animationDuration
          })
        }
      }
      return series
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.myLegend,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: this.mySeries
      })
    }
  }
}
</script>
