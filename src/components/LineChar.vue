<script>
  import {Line} from 'vue-chartjs'
  export default {
    extends: Line,
    props: ["chartData"]
    ,
    data () {
      return {
        chartInitData: this.chartData,
        colorSets: [
          {fore: 'blue', back: 'blue'},
          {fore: '#F48FB1', back: '#880E4F'}
        ],
        datacollection: {
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            }],
            xAxes: [ {
              gridLines: {
                display: true
              }
            }]
          },
          legend: {
            display: true // 색상 의미 표시
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      }
    },
    methods: {
      initChart() {
        let data = this.chartInitData.chartData
        let datasets = []
        let pos = 0

        for (var el of data) {
          let colors = this.colorSets[pos]
          datasets.push({
            label: el.label,
            borderWidth: 1,
            borderColor: colors.fore,
            pointBorderColor: colors.fore,
            pointbackgroundColor: colors.fore,
            backgroundColor: colors.fore,
            fill: false,
            data: el.data
          })
          pos++
        }
        // data.forEach((el) => {
        //   let colors = this.colorSets[pos]

        //   datasets.push({
        //     label: el.label,
        //     borderWidth: 2,
        //     borderColor: colors.back,
        //     pointBorderColor: colors.fore,
        //     pointbackgroundColor: colors.fore,
        //     fill: false,
        //     data: site.data
        //   })
        //   pos++
        // })
        this.datacollection = {
          labels: this.chartData.labels,
          datasets: datasets
        }

        this.render()
      },
      render() {
        this.renderChart(this.datacollection, this.options)
      }
    },
    mounted () {
      this.initChart()
    }
  }
</script>
