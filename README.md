# node-rdm6300
nodejs RDM6300 125khz RFID lib

## Prerequisites
 * A 125KHz RFID RDM6300 module
 * An USB TTL adapter

## Installation

install this package from npm

```bash
npm install node-rdm6300
```

## Usage

```ts
import Rdm6300 from 'node-rdm6300';
const rdm = new Rdm6300({ path: '/dev/tty.usbserial-0001' });
rdm.on('cardIn', (cardId) => {console.log('card in', cardId);});
```

## Document
https://chnbohwr.github.io/node-rdm6300/classes/Rdm6300.html

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)