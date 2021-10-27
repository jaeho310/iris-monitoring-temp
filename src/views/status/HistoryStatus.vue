<template>
  <v-main
    class="fill-width text-left"
  >
    <div class="text-h3 font-weight-bold mb-1">
      History
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
      :items="historyTableBody"
      :headers="historyTableHeader"
      dense
      class="elevation-1"
      hide-default-footer
      :items-per-page="-1"
      :loading="tableLoading"
      loading-text="Loading..."
    >
    <template
        v-slot:item="{ item, index }"
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
  </v-main>
</template>
<script>
import api from "@/util/api"
import dialog from "@/util/dialog"
import CustomDatePicker from "@/components/CustomDatePicker"
export default {
  name: 'HistoryStatus',
  components: {
    CustomDatePicker,
  },
  data() {
    return {
      totalPages: 0,
      page: 1,
      tableHeight: '0',
      tableLoading: true,
      cnt: 100,
      start: this.getFormatDate(new Date()),
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
    searchBtnClick() {
      this.page = 1
      this.getHistory()
    },
    pageClick(page) {
      this.page = page
      this.getHistory()
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
            for (var el of res.data.result.data.content) {
              el["createAt"] = this.timestamp(el["createAt"])
            }
            this.historyTableBody = res.data.result.data.content
            this.totalPages = res.data.result.data.totalPages
          } else {
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
    getHistory() {
      this.tableLoading = true
      api({
        url: '/api/v1/histories/filter',
        method: 'get',
        params: {
          page: this.page-1,
          size: this.cnt,
          start: this.start,
          end: this.end,
        }
      })
      .then(this.fillHistoryTableBody)
      .catch(err => {
        dialog.makeDialog({text: '에러가 발생하였습니다'})
      })
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
      let d=new Date(utcMilliSecond)
      return d.getFullYear()+"-"+ this.pad(d.getMonth()+1)+"-"+ this.pad(d.getDate())+" "+ this.pad(d.getHours())+":"+ this.pad(d.getMinutes())+
      ":"+ this.pad(d.getSeconds()) + '.' + this.millipad(d.getMilliseconds())
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.setTableHeight()
    this.getHistory()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>
<style>
</style>
