import React, { useCallback, useState } from 'react';
import './App.css';

function App() {
  const [device, setDevice] = useState<SerialPort | null>(null);
  const [data, setData] = useState<string[]>([]);

  const onClick = useCallback(async () => {
    try {
      const d = await navigator.serial.requestPort();
      await d.open({
        baudRate: 9600,
      });

      setDevice(d);
    } catch (e) {
      console.error(e);
      alert(e);
    }

  }, []);

  const readData = useCallback(async () => {
    if (!device || !device.readable) {
      alert("Device is not readable");
      return;
    }

    const reader = device.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        console.log("Read from serial: ", value, done);
        if (done) {
          // |reader| has been canceled.
          break;
        }

        const newData = new TextDecoder().decode(value);
        setData((old) => [...old, newData]);
      }
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      reader.releaseLock();
    }
  }, [device]);

  return (
    <div >
      <button onClick={onClick}>Connect</button>
      {device && <div>
        <button onClick={readData}>Read Data</button>
        usbVendorId: {device.getInfo().usbVendorId}
        usbProductId: {device.getInfo().usbProductId}
      </div>}
      {data.map((entry, id) => {

        return <div key={id}>
          Read #{id}:
          <pre>{entry}</pre>
        </div>
      })}
    </div>
  );
}

export default App;
