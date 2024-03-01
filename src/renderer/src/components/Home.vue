<template>
  <v-layout>
    <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn variant="text" @click="dialog = false"> 断开 </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list lines="two" subheader>
          <v-list-subheader>User Controls</v-list-subheader>
          <v-list-item
            title="Content filtering"
            subtitle="Set the content filtering level to restrict apps that can be downloaded"
          ></v-list-item>
          <v-list-item
            title="Password"
            subtitle="Require password for purchase or use password to restrict purchase"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list lines="two" subheader>
          <v-list-subheader>General</v-list-subheader>
          <v-list-item
            title="Notifications"
            subtitle="Notify me about updates to apps or games that I downloaded"
          >
            <template v-slot:prepend> </template>
          </v-list-item>
          <v-list-item
            title="Sound"
            subtitle="Auto-update apps at any time. Data charges may apply"
          >
            <template v-slot:prepend> </template>
          </v-list-item>
          <v-list-item title="Auto-add widgets" subtitle="Automatically add home screen widgets">
            <template v-slot:prepend> </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-app-bar color="primary" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Wheat BLE</v-app-bar-title>

      <template v-slot:append>
        <v-tooltip text="过滤设备">
          <template v-slot:activator="{ props }"
            ><v-btn v-bind="props" icon="mdi-filter-outline"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="刷新设备">
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
            @click="dialog = true"
            v-for="item in bleDeviceList"
            :key="item.address"
            :title="item.advertisement.localName"
            :subtitle="item.address.toUpperCase()"
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
const dialog = ref(false)
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

countDown(10)

const refreshBleBtn = async () => {
  bleDeviceList.value = []
  refreshProgressVisible.value = true
  noble.startScanning([], true)
  countDown(10)
}
</script>
