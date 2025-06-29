// jest.setup.js

// Полифил для TextEncoder/TextDecoder (если нужно)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

