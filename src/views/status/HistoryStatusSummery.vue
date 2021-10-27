<template>
  <v-main
    class="fill-width text-left mt-1"
  >
    <v-data-table
      height="195"
      fixed-header
      :items="historyTableBody"
      :headers="historyTableHeader"
      dense
      class="elevation-1"
      :items-per-page="-1"
      :loading="tableLoading"
      loading-text="Loading..."
      hide-default-footer
    >
    <template
        v-slot:item="{ item }"
      >
        <tr
        :data-category-id="historyTableHeader.id"
        :data-id="item.id">
          <td>{{ item.kind }}</td>
          <td>{{ item.reason }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.namespace }}</td>
          <td>{{ item.createAt }}</td>
      </tr>
      </template>
    </v-data-table>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn
        class="mr-3 mt-3"
        @click="toHistoryStatus"
        small
      >
      자세히
      </v-btn>
    </v-row>
  </v-main>
</template>
<script>
import api from "@/util/api"
import dialog from "@/util/dialog"
export default {
  name: 'HistoryStatusSummery',
  data() {
    return {
      interval: null,
      tableLoading: true,
      search: '',
      page: 1,
      cnt: 100,
      start: this.getFormatDate(new Date(0)),
      end: this.getFormatDate(new Date()),
      historyTableHeader : [
        {
          sortable: true,
          text: 'kind',
          value: 'kind',
        },
        {
          sortable: true,
          text: 'reason',
          value: 'reason',
        },
        {
          sortable: true,
          text: 'name',
          value: 'name',
        },
        {
          sortable: true,
          text: 'namespace',
          value: 'namespace',
        },
        {
          sortable: true,
          text: 'create time',
          value: 'create time',
        },
      ],

      historyTableBody : [],
      picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    }
  },
  methods: {
    toHistoryStatus() {
      this.$router.push(`/status/history`).catch(err => err)
    },
    getFormatDate(date) {
      let year = date.getFullYear();
      let month = (1 + date.getMonth());
      month = month >= 10 ? month : '0' + month;
      var day = date.getDate();
      day = day >= 10 ? day : '0' + day;
      return  year + '-' + month + '-' + day;
    },
    fillHistoryTableBody(res) {
      return new Promise((resolve, reject) => {
        try {
          if (res.data.success) {
            for (var el of res.data.result.data) {
              el["createAt"] = this.timestamp(el["createAt"])
            }
            this.historyTableBody = res.data.result.data
          } else {
            dialog.makeDialog({'text': `${res.data.result.message}`})
            this.stopInterval()
          }
          this.tableLoading = false
          resolve()
        } catch (error) {
          this.tableLoading = false
          reject(error)
        }
      })
    },
    getDefaultHistory() {
      api({
        url: '/api/v1/histories',
        method: 'get',
        params: {
          page: 0,
          size: 30
        }
      })
      .then(this.fillHistoryTableBody)
      .catch(err => {
        dialog.makeDialog({'text': "에러가 발생하였습니다"})
        this.stopInterval()
        this.tableLoading = false
        console.log(err)})
    },
    stopInterval() {
      clearInterval(this.interval)
    },
    pad(n) {
      return n<10 ? "0"+n : n
    },
    millipad(n) {
      if (n < 10) {
        return "00"+n
      } else if (n < 100) {
        return "0"+n
      } else {
        return n
      }
    },
    timestamp(utcMilliSecond) {
      let d=new Date(utcMilliSecond)
      return d.getFullYear()+"-"+ this.pad(d.getMonth()+1)+"-"+ this.pad(d.getDate())+" "+ this.pad(d.getHours())+":"+ this.pad(d.getMinutes())+
      ":"+ this.pad(d.getSeconds()) + '.' + this.millipad(d.getMilliseconds())
    },
  },
  mounted() {
    this.getDefaultHistory()
    this.interval = setInterval(this.getDefaultHistory, 5000)
  },
  beforeDestroy() {
    this.stopInterval()
  }
}
</script>
<style>
</style>
