import React from "react";

const serviceId = "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2".toLowerCase();
export const useThermalPrinter = () => {
  /** state to handle device status */
  const [device, setDevice] = React.useState<BluetoothDevice | undefined>(
    undefined,
  );

  /** state to handle device bluetooth connection
   * connect and disconnect
   */
  const [server, setServer] = React.useState<BluetoothRemoteGATTServer>();

  const [characteristic, setCharacteristic] =
    React.useState<BluetoothRemoteGATTCharacteristic>();

  const onConnectDevice = async () => {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "RPP02N" }],
      optionalServices: [serviceId],
    });
    setDevice(device);

    const server = await device.gatt?.connect();
    setServer(server);

    const service = await server?.getPrimaryService(serviceId);
    const characteristic = (await service?.getCharacteristics())?.at(0);
    setCharacteristic(characteristic);
  };

  const onDisconnectDevice = () => server?.disconnect();

  const onPrint = async (data: Uint8Array) => {
    const chunkSize = 512;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.subarray(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      await characteristic?.writeValue(chunk);
    }
  };

  return {
    device,
    characteristic,
    onConnectDevice,
    onDisconnectDevice,
    onPrint,
  };
};
