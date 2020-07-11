module.exports = {
  'src/**/*.scss': [
    'npm run lint:style'
  ],
  'src/**/*.{js,jsx,ts,tsx}': [
    'npm run lint'
  ],
  'src/**/*.vue': [
    'npm run lint:style',
    'npm run lint'
  ]
}
