<template>
  <v-main
    class="fill-width text-left"
    width="100%"
  >
    <div class="text-h3 font-weight-bold mb-1">
      STATUS
    </div>

    <v-data-table
      :height="tableHeight"
      fixed-header
      :items="PodStatusTableBody"
      :headers="PodStatusTableHeader"
      dense
      class="elevation-1"
      :loading="podStatusLoading"
      loading-text="Loading..."
      :footer-props="{
        'items-per-page-options': [10, 20, 30, 40, 50, 1000]
      }"
      :items-per-page="1000"
      hide-default-footer
    >
    <template
        v-slot:item="{ item, index }"
      >
        <tr
        :class="changeRowColor(item, index)"
        :data-category-id="PodStatusTableHeader.id"
        :data-id="item.name">
          <td>{{ item.podName }}</td>
          <td>{{ item.version }}</td>
          <td>{{ item.ready }}</td>
          <td>{{ item.running }}</td>
          <td>{{ item.startTime }}</td>
          <td>
            {{ item.alarmCount }}
          </td>
      </tr>
      </template>

    </v-data-table>
  </v-main>
</template>
<script>
import api from "@/util/api"
import dialog from "@/util/dialog"
export default {
  name: 'PodStatus',
  data() {
    return {
      tableHeight: '0',
      podStatusLoading: true,
      PodStatusTableHeader : [
        {
          sortable: true,
          text: 'pod name',
          value: 'pod name',
        },
        {
          sortable: true,
          text: 'version',
          value: 'version',
        },
        {
          sortable: true,
          text: 'ready',
          value: 'ready',
        },
        {
          sortable: true,
          text: 'running',
          value: 'running',
        },
        {
          sortable: true,
          text: 'create time',
          value: 'create time',
        },
        {
          sortable: true,
          text: 'alarm',
          value: 'alarm count',
        },
      ],
      PodStatusTableBody : [],
      interval: null,
    }
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.handleResize);
    this.getPodStatus()
    this.interval = setInterval(this.getPodStatus, 5000)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.stopInterval()
  },
  methods: {
    stopInterval() {
      clearInterval(this.interval)
    },
    changeRowColor(item) {
    // changeRowColor(item, index) {
      // let temp = index % 4
      // switch (temp) {
      //   case 0:
      //     return 'status-critical'
      //     break;
      //   case 1:
      //     return 'status-major'
      //   case 2:
      //     return 'status-minor'
      //   default:
      //     return 'status-info'
      //     break;
      // }
      if (item.alarmCount['critical'] >= 1) {
        return 'status-critical'
      } else if (item.alarmCount['major'] >= 1) {
        return 'status-major'
      } else if (item.alarmCount['minor'] >= 1) {
        return 'status-minor'
      }
      return 'status-info'
    },
    fillPodStatusTableBody(res) {
      return new Promise((resolve, reject) => {
        try {
          if (res.data.success) {
            this.PodStatusTableBody = res.data.result.data
            // this.historyTableBody.push(res.data.result.data)
            this.podStatusLoading = false
          } else {
            this.stopInterval()
            dialog.makeDialog({'text': `${res.data.result.message}`})
          }
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    getPodStatus() {
      api({
        url: '/api/v1/status',
        method: 'get',
      })
      .then(this.fillPodStatusTableBody)
      .catch(err => {
        this.stopInterval()
          this.podStatusLoading = false
        dialog.makeDialog({'text': "에러가 발생하였습니다"})
        console.log(err)})
    },
    handleResize() {
      this.tableHeight = String(window.innerHeight - 195 - 176)
    },
    setTableHeight() {
      this.tableHeight = String(window.innerHeight - 195 - 176)
    },
  },
}
</script>
<style>
.status-critical {
  /* background-color: rgba(245, 92, 92, 0.35) !important; */
  /* background: radial-gradient(rgba(243, 77, 77, 0.85) 80%, #ffffff) !important; */
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ff5db1+0,ef017c+100;Pink+3D+%231 */
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ffe3f1+0,ffe3f1+7,ffe3f1+12,fffdfe+12,fee8ef+30,fcccd9+54,fac0ca+75,f8b4ba+100 */
  background: rgb(255,227,241); /* Old browsers */
  background: -moz-linear-gradient(top,  rgba(255,227,241,1) 0%, rgba(255,227,241,1) 7%, rgba(255,227,241,1) 12%, rgba(255,253,254,1) 12%, rgba(254,232,239,1) 30%, rgba(252,204,217,1) 54%, rgba(250,192,202,1) 75%, rgba(248,180,186,1) 100%) !important; /* FF3.6-15 */
  background: -webkit-linear-gradient(top,  rgba(255,227,241,1) 0%,rgba(255,227,241,1) 7%,rgba(255,227,241,1) 12%,rgba(255,253,254,1) 12%,rgba(254,232,239,1) 30%,rgba(252,204,217,1) 54%,rgba(250,192,202,1) 75%,rgba(248,180,186,1) 100%)!important;  /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom,  rgba(255,227,241,1) 0%,rgba(255,227,241,1) 7%,rgba(255,227,241,1) 12%,rgba(255,253,254,1) 12%,rgba(254,232,239,1) 30%,rgba(252,204,217,1) 54%,rgba(250,192,202,1) 75%,rgba(248,180,186,1) 100%)!important;  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffe3f1', endColorstr='#f8b4ba',GradientType=0 )!important;  /* IE6-9 */
}
.status-major {
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ffe3e3+0,ffe3e3+7,ffe3e3+12,fffdfd+12,feede8+30,fcd8cc+54,fad4c0+75,f8d1b4+100 */
background: rgb(255,227,227); /* Old browsers */
background: -moz-linear-gradient(top,  rgba(255,227,227,1) 0%, rgba(255,227,227,1) 7%, rgba(255,227,227,1) 12%, rgba(255,253,253,1) 12%, rgba(254,237,232,1) 30%, rgba(252,216,204,1) 54%, rgba(250,212,192,1) 75%, rgba(248,209,180,1) 100%) !important; /* FF3.6-15 */
background: -webkit-linear-gradient(top,  rgba(255,227,227,1) 0%,rgba(255,227,227,1) 7%,rgba(255,227,227,1) 12%,rgba(255,253,253,1) 12%,rgba(254,237,232,1) 30%,rgba(252,216,204,1) 54%,rgba(250,212,192,1) 75%,rgba(248,209,180,1) 100%) !important; /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom,  rgba(255,227,227,1) 0%,rgba(255,227,227,1) 7%,rgba(255,227,227,1) 12%,rgba(255,253,253,1) 12%,rgba(254,237,232,1) 30%,rgba(252,216,204,1) 54%,rgba(250,212,192,1) 75%,rgba(248,209,180,1) 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffe3e3', endColorstr='#f8d1b4',GradientType=0 ) !important; /* IE6-9 */

}
.status-minor {
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ffeac9+0,ffeac9+7,ffeac9+12,fff4e3+12,fff7cd+30,fff4af+54,fffca1+75,f9ff91+100 */
/* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#fff4e3+0,fff4e3+7,fff4e3+12,fffefd+12,fefae8+30,fcf6cc+54,faf8c0+75,f5f8b4+100 */
background: rgb(255,244,227); /* Old browsers */
background: -moz-linear-gradient(top,  rgba(255,244,227,1) 0%, rgba(255,244,227,1) 7%, rgba(255,244,227,1) 12%, rgba(255,254,253,1) 12%, rgba(254,250,232,1) 30%, rgba(252,246,204,1) 54%, rgba(250,248,192,1) 75%, rgba(245,248,180,1) 100%) !important; /* FF3.6-15 */
background: -webkit-linear-gradient(top,  rgba(255,244,227,1) 0%,rgba(255,244,227,1) 7%,rgba(255,244,227,1) 12%,rgba(255,254,253,1) 12%,rgba(254,250,232,1) 30%,rgba(252,246,204,1) 54%,rgba(250,248,192,1) 75%,rgba(245,248,180,1) 100%) !important; /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom,  rgba(255,244,227,1) 0%,rgba(255,244,227,1) 7%,rgba(255,244,227,1) 12%,rgba(255,254,253,1) 12%,rgba(254,250,232,1) 30%,rgba(252,246,204,1) 54%,rgba(250,248,192,1) 75%,rgba(245,248,180,1) 100%) !important;/* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fff4e3', endColorstr='#f5f8b4',GradientType=0 ) !important; /* IE6-9 */

}
.status-info {
  /* background-color: rgba(119, 255, 107, 0.4) !important; */
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#e1ffff+0,e1ffff+7,e1ffff+12,fdffff+12,e6f8fd+30,c8eefb+54,bee4f8+67,bee4f8+96,b1d8f5+100;Blue+Pipe+%232 */
  background: #e1ffff !important; /* Old browsers */
  background: -moz-linear-gradient(top,  #e1ffff 0%, #e1ffff 7%, #e1ffff 12%, #fdffff 12%, #e6f8fd 30%, #c8eefb 54%, #bee4f8 67%, #bee4f8 96%, #b1d8f5 100%) !important; /* FF3.6-15 */
  background: -webkit-linear-gradient(top,  #e1ffff 0%,#e1ffff 7%,#e1ffff 12%,#fdffff 12%,#e6f8fd 30%,#c8eefb 54%,#bee4f8 67%,#bee4f8 96%,#b1d8f5 100%) !important; /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom,  #e1ffff 0%,#e1ffff 7%,#e1ffff 12%,#fdffff 12%,#e6f8fd 30%,#c8eefb 54%,#bee4f8 67%,#bee4f8 96%,#b1d8f5 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e1ffff', endColorstr='#b1d8f5',GradientType=0 ) !important; /* IE6-9 */

  /* background: radial-gradient(rgba(119, 255, 107, 0.8) 80%, #ffffff) !important; */
}
</style>
