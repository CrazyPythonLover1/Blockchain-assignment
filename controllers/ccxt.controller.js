const ccxt = require('ccxt');

// 1. Get the list of coin which is tradable on Binance.
module.exports.getTradableCoins = async (req, res) => {
  try {
    // Create a new instance of the Binance exchange class
    const binance = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_SECRET_KEY,
      enableRateLimit: true,
    });
   
    const markets = await binance.loadMarkets({ limit: 5 });

    // Extract the symbols (coin names) from the markets data
    const tradableCoins = Object.keys(markets);

    res.json(tradableCoins);
  } catch (error) {
    console.error('Error fetching tradable coins:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// 2. Get the list of each coin’s average price
const getAveragePrices = async () => {
  try {
    // Create a new instance of the Binance exchange class
    const binance = new ccxt.binance({ enableRateLimit: true });

    // Fetch all the markets (trading pairs) on Binance
    const markets = await binance.loadMarkets({ limit: 5 });

    // Get the symbols (coin names) from the markets data
    const symbols = Object.keys(markets);

    // Initialize an empty object to store average prices
    const averagePrices = {};

    // Loop for 100 times or until the end of the symbols array, whichever comes first
    for (let i = 0; i < Math.min(100, symbols.length); i++) {
      const symbol = symbols[i];
      const ticker = await binance.fetchTicker(symbol);

      // Extract the average price from the ticker data
      const averagePrice = (ticker.bid + ticker.ask) / 2;

      // Add the average price to the object
      averagePrices[symbol] = averagePrice;
    }

    return averagePrices;
  } catch (error) {
    throw new Error('Error fetching average prices');
  }
};

module.exports.averagePrices = async (req, res) => {
  try {
    const averagePrices = await getAveragePrices();
    res.json(averagePrices);
  } catch (error) {
    console.error('Error fetching average prices:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};