let formattedValue = [];
const format = (unformattedValues) => {
  formattedValue = [];
  unformattedValues.map((unformattedValue) =>
    formattedValue.push(unformattedValue.text)
  );
  return formattedValue;
};

module.exports = { format };
