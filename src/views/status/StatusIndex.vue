<template>
  <v-main>
      <PodStatus/>
      <v-row>
        <v-btn-toggle
          class="mt-5"
          v-model="option"
          mandatory
          dense
          group
        >
          <v-btn value="history">
            <div class="text-h3 font-weight-bold">
              History
            </div>
          </v-btn>

          <v-btn value="alarm">
            <div class="text-h3 font-weight-bold">
              Alarm
            </div>
          </v-btn>
        </v-btn-toggle>
      </v-row>
    <div v-if="option == 'history'">
      <HistoryStatusSummery/>
    </div>
    <div v-if="option == 'alarm'" >
      <AlarmStatusSummery/>
    </div>
  </v-main>
</template>
<script>
import HistoryStatusSummery from '@/views/status/HistoryStatusSummery.vue'
import PodStatus from '@/views/status/PodStatus.vue'
import AlarmStatusSummery from '@/views/status/AlarmStatusSummery.vue'
export default {
  name: 'StatusIndex',
  components: {
      HistoryStatusSummery,
      PodStatus,
      AlarmStatusSummery
  },
  data () {
    return {
      option: '',
    }
  },
}
</script>
<style>

</style>