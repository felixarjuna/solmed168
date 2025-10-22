"use client";

import React from "react";

type ThermalPrinterContextType = {
  device: BluetoothDevice | undefined;
  server: BluetoothRemoteGATTServer | undefined;
  characteristic: BluetoothRemoteGATTCharacteristic | undefined;
  isConnected: boolean;
  connectDevice: () => Promise<void>;
  disconnectDevice: () => void;
};

const ThermalPrinterContext = React.createContext<
  ThermalPrinterContextType | undefined
>(undefined);

const serviceId = "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2".toLowerCase();

export function ThermalPrinterProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [device, setDevice] = React.useState<BluetoothDevice | undefined>(
    undefined
  );
  const [server, setServer] = React.useState<
    BluetoothRemoteGATTServer | undefined
  >(undefined);
  const [characteristic, setCharacteristic] = React.useState<
    BluetoothRemoteGATTCharacteristic | undefined
  >(undefined);
  const [isConnected, setIsConnected] = React.useState(false);

  const connectDevice = React.useCallback(async () => {
    try {
      // Request device if not already connected
      if (!device) {
        const newDevice = await navigator.bluetooth.requestDevice({
          filters: [{ name: "RPP02N" }],
          optionalServices: [serviceId],
        });
        setDevice(newDevice);

        // Set up disconnect listener
        newDevice.addEventListener("gattserverdisconnected", () => {
          setIsConnected(false);
          setServer(undefined);
          setCharacteristic(undefined);
        });

        const newServer = await newDevice.gatt?.connect();
        setServer(newServer);

        const service = await newServer?.getPrimaryService(serviceId);
        const newCharacteristic = (await service?.getCharacteristics())?.at(0);
        setCharacteristic(newCharacteristic);
        setIsConnected(true);
      } else if (!server?.connected) {
        // Reconnect if device exists but is disconnected
        const newServer = await device.gatt?.connect();
        setServer(newServer);

        const service = await newServer?.getPrimaryService(serviceId);
        const newCharacteristic = (await service?.getCharacteristics())?.at(0);
        setCharacteristic(newCharacteristic);
        setIsConnected(true);
      }
    } catch (error) {
      setIsConnected(false);
      throw error;
    }
  }, [device, server]);

  const disconnectDevice = React.useCallback(() => {
    if (server?.connected) {
      server.disconnect();
    }
    setIsConnected(false);
  }, [server]);

  const value = React.useMemo(
    () => ({
      device,
      server,
      characteristic,
      isConnected,
      connectDevice,
      disconnectDevice,
    }),
    [device, server, characteristic, isConnected, connectDevice, disconnectDevice]
  );

  return (
    <ThermalPrinterContext.Provider value={value}>
      {children}
    </ThermalPrinterContext.Provider>
  );
}

export function useThermalPrinterContext() {
  const context = React.useContext(ThermalPrinterContext);
  if (context === undefined) {
    throw new Error(
      "useThermalPrinterContext must be used within a ThermalPrinterProvider"
    );
  }
  return context;
}
