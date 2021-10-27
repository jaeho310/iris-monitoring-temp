<template>
  <v-main
    class="fill-width text-left"
    tag="section"
  >
    <v-data-table
      hide-default-footer
      :items="targetTableBody"
      :headers="targetTableHeader"
      :height="tableHeight"
      :items-per-page="-1"
      fixed-header
      dense
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
        <div class="text-h3 font-weight-bold mb-1">
          모니터링 대상(pod)
        </div>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="newMonitoringDialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              모니터링 대상 추가
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="text-h5">모니터링 대상 추가</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="newMonitoringTargetName"
                      label="감시할 pod 이름을 입력해주세요"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="saveMonitoring"
              >
                저장
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="closeMonitoring"
              >
                취소
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-toolbar>
      </template>
      <template
        v-slot:item="{ item, index }"
      >
        <tr
        :data-category-id="targetTableHeader.id"
        :data-id="item.id">
        <td>
          {{ item.id }}
        </td>
        <td>
          {{ item.name }}
        </td>
        <td>
          <div v-if="item.state" class="ml-5">
          <v-icon
            small
            @click="disableOneMonitoring(item)"
          >
            mdi-checkbox-marked-outline
          </v-icon>
          </div>
          <div v-else class="ml-5">
            <v-icon
              small
              @click="enableOneMonitoring(item)"
            >
              mdi-checkbox-blank-outline
            </v-icon>
          </div>
        </td>
        <td>
          <v-icon
            class="ml-2"
            small
            @click="deleteOneMonitoring(item)"
          >
            mdi-delete
          </v-icon>
        </td>
      </tr>
      </template>
    </v-data-table>
  </v-main>
</template>
<script>
import api from '@/util/api'
import dialog from '@/util/dialog'
export default {
  name: 'MonitoringTargetSetting',
  data() {
    return {
      tableHeight: '0',
      newMonitoringTargetName: '',
      newMonitoringDialog: false,
      dialogDelete: false,
      editedIndex: -1,
      deleteItem: {},
      // singleSelect: false,
      selectedMonitoringTarget: [],
      targetTableHeader : [
        {
          sortable: false,
          text: 'id',
          value: 'id',
        },
        {
          sortable: false,
          text: '이름',
          value: 'name',
        },
        {
          sortable: false,
          text: '감시여부',
          value: 'state',
        },
        {
          sortable: false,
          text: '삭제',
          value: 'action',
        },
      ],
      targetTableBody : [
      ],
    }
  },
  methods: {
    createMonitoringTargetRequest() {
      if (this.newMonitoringTargetName === '') {
        dialog.makeDialog({text: "감시할 pod을 입력해주세요"})
        return
      }
      api({
        url: '/api/v1/setting/target',
        method: 'post',
        // data: {name: this.monitoringTargetName, state: true}
        data: {name: this.newMonitoringTargetName, state: true}
      })
      .then(res => {
        if (res.data.success) {
          dialog.makeDialog({text: '모니터링 대상이 추가되었습니다.'})
          this.monitoringTargetName = ''
          this.targetTableBody = []
          this.getMonitoringTarget()
        } else {
          console.log(res.data)
          dialog.makeDialog({'text': `${res.data.result.message}`})
        }
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        console.log(err)})
    },
    getMonitoringTarget() {
      this.targetTableBody = []
      api({
        url: '/api/v1/setting/target',
        method: 'get',
      })
      .then(this.filltargetTableBody)
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        console.log(err)})
    },
    filltargetTableBody(res) {
      return new Promise((resolve, reject) => {
        try {
          if (res.data.success) {
            for (var el of res.data.result.data) {
              this.targetTableBody.push(el)
            }
            // dialog.makeDialog({text: 'db서버에 history데이터가 없습니다.'})
          } else {
            dialog.makeDialog({text: `${res.data.result.message}`})
          }
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteOneMonitoringRequest() {
      console.log(this.deleteItem)
      api({
        url: `/api/v1/setting/target/${this.deleteItem.id}`,
        method: 'delete',
      })
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          dialog.makeDialog({text: '삭제되었습니다.'})
          this.getMonitoringTarget()
        } else {
          dialog.makeDialog({'text': `${res.data.result.message}`})
        }
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        console.log(err)})
    },
    deleteOneMonitoring(item) {
      this.deleteItem = item
      dialog.makeDialog({text:"감시여부를 변경하려면 체크박스를 클릭하세요. 정말 삭제하시겠습니까?", question: true, callback: this.deleteOneMonitoringRequest})
    },
    enableOneMonitoring(item) {
      // let jsonData = []
      // jsonData.push(item)
      item.state = true
      api({
        url: '/api/v1/setting/target/enable',
        method: 'post',
        data: item
      })
      .then(res => {
        if (res.data.success) {
          dialog.makeDialog({text: '감시여부가 변경되었습니다.'})
        } else {
          item.state = false
          dialog.makeDialog({'text': `${res.data.result.message}`})
        }
        this.getMonitoringTarget()
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        this.getMonitoringTarget()
        console.log(err)})
    },
    disableOneMonitoring(item) {
      item.state = false
      // let jsonData = []
      // jsonData.push(item)
      api({
        url: '/api/v1/setting/target/disable',
        method: 'post',
        data: item
      })
      .then(res => {
        if (res.data.success) {
          dialog.makeDialog({text: '감시여부가 변경되었습니다.'})
        } else {
          item.state = true
          dialog.makeDialog({'text': `${res.data.result.message}`})
        }
        this.getMonitoringTarget()
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        this.getMonitoringTarget()
        console.log(err)})
    },
    closeMonitoring() {
      this.newMonitoringDialog = false
      this.newMonitoringTargetName = ''
    },
    saveMonitoring() {
      this.createMonitoringTargetRequest()
      this.closeMonitoring()
    },
    handleResize(event) {
      this.tableHeight = String(window.innerHeight - 150)
    },
    setTableHeight() {
      this.tableHeight = String(window.innerHeight - 150)
    },
    // mySleep(ms) {
    //   let wakeUpTime = Date.now() + ms;
    //   while (Date.now() < wakeUpTime) {}
    // },
    // polling() {
    //   let i = 5
    //   while (i > 0) {
    //     console.log('test')
    //     this.getMonitoringTarget()
    //     this.mySleep(1000)
    //     i -= 1
    //   }
    // }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.setTableHeight()
    // this.polling()
    this.getMonitoringTarget()

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>
<style>

</style>