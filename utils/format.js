// const data = [
//   {
//     text: 'A weighing device, especially one consisting of a rigid beam horizontally suspended by a low-friction support at its center, with identical weighing pans hung at either end, one of which holds an unknown weight while the effective weight in the other is increased by known amounts until the beam is level and motionless.',
//   },
//   {
//     text: 'A state of equilibrium or parity characterized by cancellation of all forces by equal opposing forces.',
//   },
//   { text: 'The power or means to decide.' },
//   {
//     text: 'A state of bodily equilibrium:  thrown off balance by a gust of wind. ',
//   },
//   {
//     text: 'The ability to maintain bodily equilibrium:  Gymnasts must have good balance. ',
//   },
//   {
//     text: 'A stable mental or psychological state; emotional stability.',
//   },
//   {
//     text: 'A harmonious or satisfying arrangement or proportion of parts or elements, as in a design. See Synonyms at proportion.',
//   },
//   {
//     text: 'An influence or force tending to produce equilibrium; counterpoise.',
//   },
//   {
//     text: 'The difference in magnitude between opposing forces or influences.',
//   },
//   {
//     text: 'Accounting   Equality of totals in the debit and credit sides of an account.',
//   },
// ];

let formattedValue = [];
const format = (unformattedValues) => {
  formattedValue = [];
  unformattedValues.map((unformattedValue) =>
    formattedValue.push(unformattedValue.text)
  );
  return formattedValue;
};

module.exports = { format };
