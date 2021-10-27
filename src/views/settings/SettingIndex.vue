<template lang="">
<v-main>
     <v-btn-toggle
        v-model="option"
        mandatory
        dense
        group
      >
        <v-btn value="monitoringtarget">
          <div class="text-h4 font-weight-bold">
            Monitoring target
          </div>
        </v-btn>

        <v-btn value="alarm">
          <div class="text-h4 font-weight-bold">
            alarm threashold
          </div>
        </v-btn>

        <v-btn value="history">
          <div class="text-h4 font-weight-bold">
            Retention Rule
          </div>
        </v-btn>
      </v-btn-toggle>
    <div v-if="option == 'monitoringtarget'">
      <MonitoringTargetSetting />
    </div>
    <div v-if="option == 'alarm'">
      <ThresholdSetting />
    </div>
    <div v-if="option == 'history'">
      <RetentionSetting />
    </div>
  </v-main>
</template>
<script>
import MonitoringTargetSetting from '@/views/settings/MonitoringTargetSetting.vue'
import ThresholdSetting from '@/views/settings/ThresholdSetting.vue'
import RetentionSetting from '@/views/settings/RetentionSetting.vue'
export default {
  name: 'SettingIndex',
  components: {
    MonitoringTargetSetting,
    ThresholdSetting,
    RetentionSetting
  },
  data() {
    return {
      option: '',
    }
  }
}
</script>
<style lang="scss">
// reduce button default elevation
// default background color is #EEEEEE

$btn-sizes: (
  'small': 28,
  'default': 41,
  'large': 54
);

$btn-font-sizes: (
  'default': .75rem
);

$btn-font-weight: 400;
$btn-letter-spacing: normal;
$material-light: (
  'background': #FFFFFF,
  'text': (
    'primary': #333333,
    'secondary': #999999
  )
);
$btn-icon-font-size: 1.0625rem !important;

$list-item-min-height: 48px;

$blockquote-font-size: 1.25rem;

$card-border-radius: 6px;
$card-text-font-weight: 300;
$card-elevation: 1;

$data-table-regular-header-font-size: 1.0625rem;

$shadow-key-umbra: (
  1: (0 1px 4px 0 rgba(0,0,0,.14)),
  12: (0 16px 38px -12px rgba(0,0,0,.56))
);

$shadow-key-penumbra: (
  1: (0 0 0 0 rgba(0,0,0,0)),
  12: (0 4px 25px 0 rgba(0,0,0,.12))
);

$shadow-key-ambient: (
  1: (0 0 0 0 rgba(0,0,0,0)),
  12: (0 8px 10px -5px rgba(0,0,0,.2))
);

$headings: (
  'h1': (
    'size': 3.3125rem,
    'line-height': 1.15em,
    'weight': 300
  ),
  'h2': (
    'size': 2.25rem,
    'line-height': 1.5em,
    'weight': 300
  ),
  'h3': (
    'size': 1.5625rem,
    'line-height': 1.4em,
    'weight': 300
  ),
  'h4': (
    'size': 1.125rem,
    'line-height': 1.4em,
    'weight': 300
  ),
  'h5': (
    'size': 1.0625rem,
    'line-height': 1.4em,
    'weight': 300
  ),
  'h6': (
    'size': .75rem,
    'line-height': 1.5em,
    'text-transform': uppercase,
    'weight': 500
  ),
  'subtitle-1': (
    'size': 0.875rem,
    'weight': 300
  ),
  'subtitle-2': (
    'size': 0.875rem,
    // 'line-height': 1.5em !important;,
    'weight': 300
  ),
  'caption': (
    'size': 0.8125rem,
    'weight': 300
  ),
  // 'overline': (
  //   'letter-spacing': normal,
  //   'line-height': 0.625rem,
  //   'size': 0.625rem,
  //   'weight': 500
  // )
);

// Tabs
$tab-font-size: .775rem;
$tab-font-weight: 500;
$tabs-item-letter-spacing: normal;

</style>