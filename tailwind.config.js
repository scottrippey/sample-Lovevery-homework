module.exports = {
  purge: [
    './src/**/*'
  ],
  theme: {
    fontFamily: {
      body: [ 'Raleway', 'sans-serif' ]
    },
    // Use px instead of rem:
    fontSize: generateSizes(range(10, 40, 2), 'px'),
    lineHeight: generateSizes(range(2, 60, 2), 'px'),
    spacing: generateSizes(range(-10, 100, 5), 'px'),
    inset: {
      '0': 0,
      '100': '100%',
    },
    colors: {
      'orange': '#CC4B00', // (Links)
      'yellow': '#FFC700', // (Navigation highlight)
      'blue-light': '#006EF5', // (Branding)
      'blue': '#004EAE', // (Search and Small screen navigation)
      'blue-dark': '#013371', // (hover/focus in navigation)
      'gray': '#767676', // (Meta info and placeholder text)
      'gray-dark': '#333333', // (Content and in-form search icon)
      'white': '#FFFFFF', // (Header links / icons and search input)
      'black': '#000000',
    },
    screens: {
      "lg": { min: "640px" }
    },
    extend: {
      transitionProperty: {
        'height': 'height',
      }
    },
  },
  variants: [
    // Enable all variants:
    'responsive', 'group-hover', 'group-focus', 'focus-within', 'first', 'last', 'odd', 'even', 'hover', 'focus', 'active', 'visited', 'disabled'
  ],
  plugins: [],
}

function generateSizes(values, unit = 'px') {
  const results = {};
  for (const value of values) {
    results[value] = `${value}${unit}`;
  }
  return results;
}
function range(min, max, skip = 1) {
  const results = [];
  for (let i = min; i <= max; i += skip) {
    results.push(i);
  }
  return results;
}
