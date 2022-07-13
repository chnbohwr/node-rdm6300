import Rdm6300 from '../src/index';

const rdm = new Rdm6300({ path: '/dev/tty.usbserial-0001' });

rdm.on('error', (e) => {
  console.error(e);
});

rdm.on('cardIn', (cardId) => {
  console.log('card in', cardId);
});

rdm.on('cardOut', () => {
  console.log('card out');
});

rdm.on('open', () => {
  console.log('serialport open');
});

rdm.on('error', (e) => {
  console.log('serialport error', e);
});
