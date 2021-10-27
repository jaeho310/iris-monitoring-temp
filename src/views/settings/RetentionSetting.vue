<template>
  <v-card
    class="mx-auto mt-15"
    max-width="450"
  >
    <v-card-text>
      <!-- <div>히스토리 보관일 설정</div> -->
      <p class="text-h3 font-weight-bold text--primary ">
        히스토리, 알람 보관일 설정
      </p>
      <hr style="border-top: 1px solid">
      <div class="text-h4 font-weight-medium text--primary mb-2 mt-4 ">
        보관일 설정시<br>
        매일 새벽 보관기간을 초과한 history가 삭제됩니다. <br>
        기본 설정은 1년이며 <br>
        현재 history 보관기간은 <span style="color: red">{{ historyRetention }}</span>일이며<br>
        현재 alarm 보관기간은 <span style="color: red">{{ alarmRetention }}</span>일입니다.<br>
        (보관기간이 너무 긴 경우 조회가 늦을 수 있습니다.)
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="teal accent-4"
        @click="historyReveal = true"
      >
        히스토리 보관기간 변경하기
      </v-btn>
      <v-btn
        text
        color="teal accent-4"
        @click="alarmReveal = true"
      >
        알람 보관기간 변경하기
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <v-card
        v-if="historyReveal"
        class="transition-fast-in-fast-out v-card--reveal"
        style="height: 100%;"
      >
        <v-card-text class="pb-0">
          <p class="text-h3 font-weight-medium text--primary">
            히스토리 보관일 변경
          </p>
          <!-- <hr style="border-top: 1px solid"> -->
        </v-card-text>
        <v-col>
            <v-text-field
              class="mt-2"
              label="히스토리 보관일을 선택해주세요"
              v-model="historySlider"
              outlined
              rounded
            ></v-text-field>
          <v-slider
            class="mb-5"
            v-model="historySlider"
            step="1"
            ticks
            min="1"
            max="30"
            color="blue darken-1"
          ></v-slider>
        </v-col>
        <!-- <v-radio-group
          v-model="historySlider"
          column
          class="ml-6 mt-5"
        >
          <v-radio
            label="10일"
            color="info"
            value="10"
          ></v-radio>
          <v-radio
            label="30일"
            color="info"
            value="30"
          ></v-radio>
          <v-radio
            label="50일"
            color="info"
            value="50"
          ></v-radio>
          <v-radio
            label="100일"
            color="info"
            value="100"
          ></v-radio>
          <v-radio
            label="365일"
            color="info"
            value="365"
          ></v-radio>
        </v-radio-group> -->
        <v-card-actions class="pt-0">
          <v-btn
            text
            color="teal accent-4"
            @click="updateHistory"
          >
            Save
          </v-btn>
          <v-btn
            text
            color="red accent-4"
            @click="historyReveal = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
    <v-expand-transition>
      <v-card
        v-if="alarmReveal"
        class="transition-fast-in-fast-out v-card--reveal"
        style="height: 100%;"
      >
        <v-card-text class="pb-0">
          <p class="text-h3 font-weight-medium text--primary">
            알람 보관일 변경
          </p>
          <!-- <hr style="border-top: 1px solid"> -->
        </v-card-text>
        <v-col>
            <v-text-field
              class="mt-2"
              label="알람 보관일을 선택해주세요"
              v-model="alarmSlider"
              outlined
              rounded
            ></v-text-field>
          <v-slider
            class="mb-5"
            v-model="alarmSlider"
            step="1"
            ticks
            min="1"
            max="30"
            color="orange darken-3"
            track-color = "orange lighten-2"
          ></v-slider>
        </v-col>
        <!-- <v-radio-group
          v-model="alarmSlider"
          column
          class="ml-6 mt-5"
        >
          <v-radio
            label="10일"
            color="orange darken-3"
            value="10"
          ></v-radio>
          <v-radio
            label="30일"
            color="orange darken-3"
            value="30"
          ></v-radio>
          <v-radio
            label="50일"
            color="orange darken-3"
            value="50"
          ></v-radio>
          <v-radio
            label="100일"
            color="orange darken-3"
            value="100"
          ></v-radio>
          <v-radio
            label="365일"
            color="orange darken-3"
            value="365"
          ></v-radio>
        </v-radio-group> -->
        <v-card-actions class="pt-0">
          <v-btn
            text
            color="teal accent-4"
            @click="updateAlarm"
          >
            Save
          </v-btn>
          <v-btn
            text
            color="red accent-4"
            @click="alarmReveal = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>
<script>
import api from '@/util/api'
import dialog from '@/util/dialog'
export default {
  name: 'RetentionSetting',
  data() {
    return {
      alarmSlider: 0,
      historySlider: 0,
      historyReveal: false,
      alarmReveal: false,
      historyRetention: '',
      alarmRetention: '',
    }
  },
  methods: {
    fillData(res) {
      return new Promise((resolve, reject) => {
        try {
          if (res.data.success) {
            console.log(res.data.result.data)
            for (var el in res.data.result.data) {
              if (res.data.result.data[el].type == 'HISTORY') {
                this.historyRetention = res.data.result.data[el].retentionTime
                this.historySlider = String(this.historyRetention)
              } else if (res.data.result.data[el].type == 'ALARM') {
                this.alarmRetention = res.data.result.data[el].retentionTime
                this.alarmSlider = String(this.alarmRetention)
              }
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
    getRetentionRule() {
      api({
        url: '/api/v1/setting/retention-rule',
        method: 'get',
      })
      .then(this.fillData)
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        console.log(err)})
    },
    updateHistory() {
      api({
        url: '/api/v1/setting/retention-rule',
        method: 'post',
        data: {type: 'HISTORY', retentionTime: this.historySlider}
      })
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          dialog.makeDialog({text: "히스토리 보관기간이 변경되었습니다."})
        } else {
          dialog.makeDialog({'text': `${res.data.result.message}`})
        }
        this.historyReveal = false
        this.getRetentionRule()
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        console.log(err)})
    },
    updateAlarm() {
      api({
        url: '/api/v1/setting/retention-rule',
        method: 'post',
        data: {type: 'ALARM', retentionTime: this.alarmSlider}
      })
      .then(res => {
        if (res.data.success) {
          dialog.makeDialog({text: "알람 보관기간이 변경되었습니다."})
        } else {
          dialog.makeDialog({'text': `${res.data.result.message}`})
        }
        this.alarmReveal = false
        this.getRetentionRule()
      })
      .catch(err => {
        dialog.makeDialog({text: "에러가 발생하였습니다"})
        console.log(err)})
    }
  },
  mounted() {
    this.getRetentionRule()
  },
}
</script>
<style>
  .v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
  }
</style>