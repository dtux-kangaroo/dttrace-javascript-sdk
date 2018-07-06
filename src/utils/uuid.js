const T = () => {
  const d = 1 * new Date();
  let i = 0;
  // this while loop figures how many browser ticks go by
  // before 1*new Date() returns a new number, ie the amount
  // of ticks that go by per millisecond
  while (d == 1 * new Date()) {
    i++;
  }
  return d.toString(16) + i.toString(16);
};

const R = function () {
  return Math.random().toString(16).replace('.', '');
};

// User agent entropy
// This function takes the user agent string, and then xors
// together each sequence of 8 bytes.  This produces a final
// sequence of 8 bytes which it returns as hex.
const UA =  () => {
  const ua = navigator.userAgent;
  let i, ch, buffer = [],ret = 0;

  const xor=(result, byte_array)=>{
    let j, tmp = 0;
    for (j = 0; j < byte_array.length; j++) {
      tmp |= (buffer[j] << j * 8);
    }
    return result ^ tmp;
  }

  for (i = 0; i < ua.length; i++) {
    ch = ua.charCodeAt(i);
    buffer.unshift(ch & 0xFF);
    if (buffer.length >= 4) {
      ret = xor(ret, buffer);
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    ret = xor(ret, buffer);
  }

  return ret.toString(16);
};


export default () => {
  const se = (screen.height * screen.width).toString(16);
  return T() + '-' + R() + '-' + UA() + '-' + se + '-' + T();
}