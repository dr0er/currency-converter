const FIXER_API_KEY = "51019cbe05761cfe66c1160de4357458";
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

const REST_COUNTRIES_API = `http://api.countrylayer.com/v2/currency`;

const accessKey = `?access_key=3bb1bdf6357847380ad050c07fc9426e`;

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const {
      data: { rates },
    } = await axios.get(FIXER_API);

    const euro = 1 / rates[fromCurrency];
    const exchangeRate = euro * rates[toCurrency];

    return exchangeRate;
  } catch (error) {
    throw new Error(
      `Unable to get currency ${fromCurrency} and ${toCurrency}.`
    );
  }
};

const getCountries = async (currencyCode) => {
  try {
    const { data } = await axios.get(
      `${REST_COUNTRIES_API}/${currencyCode}${accessKey}`
    );

    return data.map(({ name }) => name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}.`);
  }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  fromCurrency = fromCurrency.toUpperCase();
  toCurrency = toCurrency.toUpperCase();

  const [exchangeRate, countries] = await Promise.all([
    await getExchangeRate(fromCurrency, toCurrency),
    await getCountries(toCurrency),
  ]);

  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
    You can spend these in the following countries: ${countries}.`;
};

convertCurrency("USD", "HRK", 20)
  // .then((result) => console.log(result))
  .then((result) => (document.getElementById("one").innerHTML = result))
  .catch((error) => console.log(error));
