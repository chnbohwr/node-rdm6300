import { SerialPort } from 'serialport';
import events from 'events';

declare interface Rdm6300 {
  on(event: 'cardIn', listener: (cardId: string) => void): this;
  on(event: 'cardOut', listener: Function): this;
  on(event: 'open', listener: Function): this;
  on(event: 'error', listener: (error: Error) => void): this;
}

type Options = {
  path: string;
}

/**
 * Nodejs Serialport connect to RDM6300 lib,
 * this lib will emit id when rfid reader trigger.
 * ### Prerequisites
 *  * A 125KHz RFID RDM6300 module
 *  * An USB TTL adapter
 * ```ts
 * import Rdm6300 from 'node-rdm6300';
 * const rdm = new Rdm6300({ path: '/dev/tty.usbserial-0001' });
 * rdm.on('cardIn', (cardId) => {console.log('card in', cardId);});
 * ```
 */
class Rdm6300 extends events.EventEmitter {
  /**
   * @hidden
   */
  active = false;
  /**
   * @hidden
   */
  bufferArr: Array<Buffer> = [];
  /**
   * @hidden
   */
  nowId: string = '';
  /**
   * @hidden
   */
  clearIdTimeout: NodeJS.Timeout = setTimeout(() => { }, 0);
  port: SerialPort;
  constructor(options?: Options) {
    super();
    const self = this;
    this.port = new SerialPort({
      path: options ? options.path : '/dev/tty.usbserial-0001',
      baudRate: 9600,
    });
    this.port.on('data', this.onData.bind(self));
    this.port.on('open', this.onOpen.bind(self));
    this.port.on('error', this.onError.bind(self));
    setInterval(() => {
      const { port } = self;
      if (port.isOpen === false) {
        try {
          port.open();
        } catch (e) {
          // console.error(e);
        }
      }
    }, 3000)
  }
  /**
   * @hidden
   */
  clearNowId() {
    this.nowId = '';
    this.emit('cardOut');
  }
  /**
   * @hidden
   * @param id 
   */
  processData(id: string) {
    if (id !== this.nowId) {
      this.nowId = id;
      this.emit('cardIn', id);
    }
    clearTimeout(this.clearIdTimeout);
    this.clearIdTimeout = setTimeout(this.clearNowId.bind(this), 1000);
  }
  /**
   * @hidden
   */
  onData(buffer: Buffer) {
    this.bufferArr.push(buffer);
    if (buffer[buffer.length - 1] === 0x03) {
      const newBuffer = Buffer.concat(this.bufferArr);
      if (newBuffer.length === 14) {
        const resultBuffer = newBuffer.slice(1, 13);
        // console.log(resultBuffer);
        const resultIdHex = resultBuffer.toString().substring(0, 10);
        const resultIdInt = parseInt(resultIdHex, 16);
        const resultId = String(resultIdInt).padStart(10, '0');
        this.processData(resultId);
      }
      this.bufferArr = [];
    }
  }
  /**
   * @hidden
   */
  onOpen() {
    this.emit('open');
  }
  /**
   * @hidden
   */
  onError(e: Error) {
    this.emit('error', e);
  }
}

export default Rdm6300;