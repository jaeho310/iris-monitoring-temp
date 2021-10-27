<template>
  <v-main
    class="fill-width text-left"
    tag="section"
  >
    <v-data-table
      :items="thresholdTableBody"
      :headers="thresholdTableHeader"
      dense
      class="elevation-1"
      hide-default-footer
      :items-per-page="-1"
      fixed-header
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
        <div class="text-h3 font-weight-bold mb-1">
          알람발생 조건
        </div>
          <v-spacer></v-spacer>
        <v-dialog
          v-model="dialogCreate"
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
              알람 조건 추가
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="text-h5">알람 조건 추가</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-combobox
                    v-model="selectedType"
                    label="타입선택"
                    :items="typeList"
                    ></v-combobox>
                  </v-col>
                  <v-col>
                    <v-combobox
                    v-model="selectedLevel"
                    label="레벨선택"
                    :items="levelList"
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-combobox
                    v-model="selectedValueType"
                    label="단위선택"
                    :items="valueTypeList"
                    ></v-combobox>
                  </v-col>
                  <v-col>
                    <v-combobox
                    v-model="selectedInequalitySign"
                    label="비교방식선택"
                    :items="inequalitySignList"
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="inputValue"
                      label="값을 입력해주세요"
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
                @click="save"
              >
                저장
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
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
        :data-category-id="thresholdTableHeader.id"
        :data-id="item.id">
        <td>
          {{ item.type }}
        </td>
        <td>
          {{ item.level }}
        </td>
        <td>
          {{ item.valueType }}
        </td>
        <td>
          {{ item.value }}
        </td>
        <td>
          {{ item.inequalitySign }}
        </td>
        <td>
          {{ item.createdAt }}
        </td>
        <td>
          {{ item.updatedAt }}
        </td>
        <td>
          <v-icon
            class="mr-2"
            small
            @click="updateThreshold(item)"
          >
            mdi-pencil
          </v-icon>
          </div>
          <v-icon
            small
            @click="deleteThreshold(item)"
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
  name: 'ThresholdSetting',
  data() {
    return {
      inputValue: '',
      selectedType: '',
      selectedLevel: '',
      selectedValueType: '',
      selectedInequalitySign: '',
      typeList: [
        'CPU', 'MEM', 'STATE', 'NET', "FILE"
      ],
      levelList: [
        'MINOR', 'MAJOR', 'CRITICAL'
      ],
      valueTypeList: [
        'PERCENT_VALUE', 'REAL_VALUE'
      ],
      inequalitySignList: [
        'GREATER', 'LESS'
      ],
      newthresholdName: '',
      dialogCreate: false,
      dialogDelete: false,
      editedIndex: -1,
      deleteId: '',
      updateId: '',
      createTime: '',
      // singleSelect: false,
      selectedthreshold: [],
      thresholdTableHeader : [
        {
          sortable: false,
          text: '타입',
          value: 'type',
        },
        {
          sortable: false,
          text: '레벨',
          value: 'level',
        },
        {
          sortable: false,
          text: '단위',
          value: 'valueType',
        },
        {
          sortable: false,
          text: '값',
          value: 'value',
        },
        {
          sortable: false,
          text: '비교방식',
          value: 'inequalitySign',
        },
        {
          sortable: false,
          text: '생성일',
          value: 'createdAt',
        },
        {
          sortable: false,
          text: '변경일',
          value: 'updatedAt',
        },
        {
          sortable: false,
          text: '편집'
        }
      ],
      thresholdTableBody : [],
    }
  },
  methods: {
    updateThreshold(item) {
      this.updateId = item.id
      this.createTime = item.createdAt
      this.selectedType = item.type
      this.selectedLevel = item.level
      this.selectedValueType = item.valueType
      this.selectedInequalitySign = item.inequalitySign
      this.inputValue = item.value
      this.dialogCreate = true
    },
    deleteRequest() {
      api({
        url: `/api/v1/setting/threshold/${this.deleteId}`,
        method: 'delete',
      })
      .then(res => {
        if (res.data.success) {
          dialog.makeDialog({text: '삭제되었습니다.'})
        } else {
          dialog.makeDialog({'text': `${res.data.result.message}`})
        }
        this.getthreshold()
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다."})
        console.log(err)
      })
    },
    deleteThreshold(item) {
      this.deleteId = item.id
      dialog.makeDialog({text: '정말 삭제하시겠습니까?', question: true, callback: this.deleteRequest})
    },
    fillTable(res) {
      return new Promise((resolve, reject) => {
        try {
          if (res.data.success) {
            for (var el of res.data.result.data) {
              this.thresholdTableBody.push(el)
            }
          } else {
            dialog.makeDialog({text: `${res.data.result.message}`})
          }
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    getthreshold() {
      this.thresholdTableBody = []
      api({
        url: '/api/v1/setting/threshold',
        method: 'get',
      })
      .then(this.fillTable)
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다."})
        console.log(err)
      })
    },
    updateThresholdRequest() {
      if (
        this.inputValue == '' ||
        this.selectedType == '' ||
        this.selectedLevel == '' ||
        this.selectedValueType == '' ||
        this.selectedInequalitySign == ''
      ) {
        dialog.makeDialog({text: '잘못 입력하셨습니다.'})
        return;
      }
      api({
        url: '/api/v1/setting/threshold',
        method: 'patch',
        // data: {name: this.monitoringTargetName, state: true}
        data: {
          type: this.selectedType,
          level: this.selectedLevel,
          inequalitySign: this.selectedInequalitySign,
          valueType: this.selectedValueType,
          value: this.inputValue,
          createdAt: this.createTime,
          id: this.updateId
        }
      })
      .then(res => {
        if (res.data.success) {
          dialog.makeDialog({text: '알람 발생조건이 변경되었습니다.'})
          this.thresholdTableBody = []
          this.getthreshold()
        } else {
          console.log(res.data)
          dialog.makeDialog({text: `${res.data.result.message}`})
        }
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        console.log(err)})
    },
    createThresholdRequest() {
      if (
        this.inputValue == '' ||
        this.selectedType == '' ||
        this.selectedLevel == '' ||
        this.selectedValueType == '' ||
        this.selectedInequalitySign == ''
      ) {
        dialog.makeDialog({text: '잘못 입력하셨습니다.'})
        return;
      }
      api({
        url: '/api/v1/setting/threshold',
        method: 'post',
        // data: {name: this.monitoringTargetName, state: true}
        data: {
          type: this.selectedType,
          level: this.selectedLevel,
          inequalitySign: this.selectedInequalitySign,
          valueType: this.selectedValueType,
          value: this.inputValue,
        }
      })
      .then(res => {
        if (res.data.success) {
          dialog.makeDialog({text: '알람 발생조건이 추가되었습니다.'})
          this.thresholdTableBody = []
          this.getthreshold()
        } else {
          dialog.makeDialog({text: `${res.data.result.message}`})
        }
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        console.log(err)})
    },
    close() {
      this.dialogCreate = false
      this.inputValue = ''
      this.selectedType = ''
      this.selectedLevel = ''
      this.selectedValueType = ''
      this.selectedInequalitySign = ''
      this.updateId = ''
      this.createTime = ''
    },
    save() {
      if (this.updateId == '') {
        this.createThresholdRequest()
      } else {
        this.updateThresholdRequest()
      }
      this.close()
    },
    handleResize(event) {
      this.tableHeight = String(window.innerHeight - 176)
    },
    setTableHeight() {
      this.tableHeight = String(window.innerHeight - 176)
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.setTableHeight()
    this.getthreshold()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>
<style>

</style>