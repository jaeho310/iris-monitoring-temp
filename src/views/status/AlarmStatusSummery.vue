<template>
  <v-main
    tag="section"
    class="fill-width text-left mt-1"
  >
    <v-data-table
      height="195"
      fixed-header
      :items="tableBody"
      :headers="tableHeader"
      dense
      class="elevation-1"
      :items-per-page="-1"
      hide-default-footer
      :loading="tableLoading"
      loading-text="Loading..."
    >
    <template
        v-slot:item="{ item, index }"
      >
        <tr
        :data-category-id="tableHeader.id"
        :data-id="item.id">
          <td>{{ item.type }}</td>
          <td>{{ item.level }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.namespace }}</td>
          <td>{{ item.message }}</td>
          <td>{{ item.createAt }}</td>
          <td>{{ item.clearAt }}</td>
      </tr>
      </template>
    </v-data-table>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn
        class="mr-3 mt-3"
        @click="toAlarmStatus"
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
  name: 'AlarmStatusSummery',
  data() {
    return {
      interval: null,
      tableLoading: true,
      tableHeader : [
        {
          sortable: true,
          text: 'type',
          value: 'type',
        },
        {
          sortable: true,
          text: 'level',
          value: 'level',
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
          text: 'message',
          value: 'message',
        },
        {
          sortable: true,
          text: 'create time',
          value: 'create time',
        },
        {
          sortable: true,
          text: 'clear time',
          value: 'clear time',
        },
      ],
      tableBody : []
    }
  },
  methods: {
    toAlarmStatus() {
      this.$router.push(`/status/alarm`).catch(err => err)
    },
    fillAlarmTableBody(res) {
      return new Promise((resolve, reject) => {
        try {
          if (res.data.success) {
            for (var el of res.data.result.data) {
              el["createAt"] = this.timestamp(el["createAt"])
              el["clearAt"] = this.timestamp(el["clearAt"])
            }
            this.tableBody = res.data.result.data
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
    getAlarm() {
      api({
        url: '/api/v1/alarm',
        method: 'get',
        params: {
          page: -1,
          size: 0
        }
      })
      .then(this.fillAlarmTableBody)
      .catch(err => {
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
      if (!utcMilliSecond) {
        return ''
      }
      let d=new Date(utcMilliSecond)
      return d.getFullYear()+"-"+ this.pad(d.getMonth()+1)+"-"+ this.pad(d.getDate())+" "+ this.pad(d.getHours())+":"+ this.pad(d.getMinutes())+
      ":"+ this.pad(d.getSeconds()) + '.' + this.millipad(d.getMilliseconds())
    },
  },
  mounted() {
    this.getAlarm()
    this.interval = setInterval(this.getAlarm, 5000)
  },
  beforeDestroy() {
    this.stopInterval()
  }
}
</script>
<style lang="scss">

</style>
