<template>
  <v-main
    tag="section"
    class="fill-width text-left"
  >
    <div class="text-h3 font-weight-bold mb-1">
      Alarm
    </div>
    <v-row>
      <v-col>
        <v-text-field v-model="start" label="시작일">
          <template v-slot:append-outer>
            <custom-date-picker v-model="start" />
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="end" label="종료일">
            <template v-slot:append-outer>
              <custom-date-picker v-model="end" />
            </template>
          </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="목록 갯수"
          v-model="cnt"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-checkbox
          v-model="isClear"
          :label="`클리어되지 않은 알람만 보기`"
        ></v-checkbox>
      </v-col>
      <v-col>
        <v-btn
          small
          class="mt-4"
          @click="searchBtnClick"
        >
          검색
        </v-btn>
      </v-col>
      <v-col cols="2.2">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="10"
          class="mt-2"
          @input="pageClick"
        ></v-pagination>
      </v-col>
    </v-row>
    <v-data-table
      :height="tableHeight"
      fixed-header
      :items="tableBody"
      :headers="tableHeader"
      dense
      class="elevation-1"
      :items-per-page="-1"
      :loading="tableLoading"
      loading-text="Loading..."
      hide-default-footer
    >
      <!-- hide-default-footer -->
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

  </v-main>
</template>
<script>
import api from "@/util/api"
import dialog from "@/util/dialog"
import CustomDatePicker from "@/components/CustomDatePicker"
export default {
  name: 'AlarmStatus',
  components: {
    CustomDatePicker,
  },
  data() {
    return {
      totalPages: 0,
      isClear: false,
      tableHeight: '0',
      page: 1,
      cnt: 100,
      start: this.getFormatDate(new Date()),
      end: this.getFormatDate(new Date()),
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
    searchBtnClick() {
      this.page = 1
      this.getAlarm()
    },
    pageClick(page) {
      console.log('test')
      this.page = page
      this.getAlarm()
    },
    getFormatDate(date) {
      let year = date.getFullYear();
      let month = (1 + date.getMonth());
      month = month >= 10 ? month : '0' + month;
      var day = date.getDate();
      day = day >= 10 ? day : '0' + day;
      return  year + '-' + month + '-' + day;
    },
    fillAlarmTableBody(res) {
      return new Promise((resolve, reject) => {
        try {
          if (res.data.success) {
            for (var el of res.data.result.data.content) {
              el["createAt"] = this.timestamp(el["createAt"])
              el["clearAt"] = this.timestamp(el["clearAt"])
            }
            this.tableBody = res.data.result.data.content
            this.totalPages = res.data.result.data.totalPages
          } else {
            console.log("fail")
            dialog.makeDialog({'text': `${res.data.result.message}`})
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
        url: '/api/v1/alarm/filter',
        method: 'get',
        params: {
          start: this.start,
          end: this.end,
          page: this.page-1,
          size: this.cnt,
          clear: !this.isClear
        }
      })
      .then(this.fillAlarmTableBody)
      .catch(err => {
        dialog.makeDialog({'text': "에러가 발생하였습니다"})
        this.tableLoading = false
        console.log(err)})
    },
    handleResize(event) {
      this.tableHeight = String(window.innerHeight - 176)
    },
    setTableHeight() {
      this.tableHeight = String(window.innerHeight - 176)
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
    window.addEventListener('resize', this.handleResize);
    this.setTableHeight()
    this.getAlarm()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>
<style>
  .history-datepicker-textfield {
    width: 55px !important;
  }
</style>
