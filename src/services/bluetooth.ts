// src/services/bluetooth.ts
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

const manager = new BleManager();

// Solicitar permissões Android
export const solicitarPermissoes = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }
};

// Escanear dispositivos próximos
export const escanearDispositivos = (
  onEncontrado: (device: Device) => void
) => {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) { console.error(error); return; }
    if (device?.name?.startsWith('SF-')) { // Dispositivos ShareFast
      onEncontrado(device);
    }
  });
  return () => manager.stopDeviceScan();
};