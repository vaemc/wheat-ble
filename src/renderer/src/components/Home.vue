<template>
  <v-layout>
    <v-app-bar color="primary" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Wheat BLE</v-app-bar-title>

      <template v-slot:append>
        <v-tooltip text="刷新蓝牙设备">
          <template v-slot:activator="{ props }"
            ><v-btn v-bind="props" icon="mdi-refresh" @click="refreshBleBtn"></v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-app-bar>

    <v-main>
      <v-progress-linear
        v-if="refreshProgressVisible"
        height="10"
        striped
        stream
        indeterminate
        color="primary"
      ></v-progress-linear>
      <v-container fluid>
        <v-list lines="two">
          <v-list-subheader inset>设备列表</v-list-subheader>

          <v-list-item
            @click=""
            v-for="item in bleDeviceList"
            :key="item.address"
            :title="item.advertisement.localName"
            :subtitle="item.address"
          >
            <template v-slot:prepend>
              <v-avatar color="blue">
                <v-icon icon="mdi-bluetooth"></v-icon>
              </v-avatar>
            </template>

            <template v-slot:append>
              <div>
                {{ item.rssi }} dBm
                <v-icon icon="mdi-signal-cellular-3"></v-icon>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import noble, { Peripheral } from '@abandonware/noble'
const bleDeviceList = ref([] as Peripheral[])
const refreshProgressVisible = ref(false)
refreshProgressVisible.value = true

noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    console.log('Scanning')
    noble.startScanning([], true)
  } else {
    noble.stopScanning()
  }
})

noble.on('discover', (peripheral) => {
  console.log(peripheral)

  let bt = bleDeviceList.value.find((x) => x.address == peripheral.address)
  if (bt == null) {
    bleDeviceList.value.push(peripheral)
  } else {
    bleDeviceList.value.map((x: Peripheral) => {
      if (x.address == peripheral.address) {
        return peripheral
      }
      return
    })
  }
})

const countDown = (seconds: number) => {
  let count = seconds
  const timer = setInterval(() => {
    if (count > 0) {
      count--
      console.log(`倒计时: ${count}`)
    } else {
      noble.stopScanning()
      refreshProgressVisible.value = false
      clearInterval(timer)
    }
  }, 1000)
}

countDown(5)

const refreshBleBtn = async () => {
  bleDeviceList.value = []
  refreshProgressVisible.value = true
  noble.startScanning([], true)
  countDown(5)
}
</script>
