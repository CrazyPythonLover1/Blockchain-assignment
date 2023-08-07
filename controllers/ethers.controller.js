const ethers = require("ethers");

const provider = new ethers.InfuraProvider('mainnet', process.env.INFURA_API_KEY);

// 1. Returning boolean of whether the wallet address is valid.
module.exports.isValidWalletAddress = async (req, res) => {
  // Get the wallet address from the request parameters and convert it to lowercase
  const address = req.params.address.toLowerCase();

  // Check if the address is provided
  if (!address) {
    return res.json({ isValid: false, message: 'Address is required' });
  }

  try {
    // Check if the address is a valid Ethereum wallet address
    const isValid = ethers.isAddress(address);

    // Return the result as JSON response
    res.json({ isValidWalletAddress:isValid });
  } catch (error) {
    // Handle any errors that occur during address validation
    res.json({ isValid: false, message: 'Invalid address' });
  }
};


// 2. API endpoint to create a wallet
module.exports.createWallet = async (req, res) => {
  try {
    // Create a new wallet
    const wallet = ethers.Wallet.createRandom();

    // Return the wallet address and private key as JSON response
    res.json({
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  } catch (error) {
    // Handle any errors that occur during wallet creation
    res.status(500).json({ error: 'Failed to create wallet' });
  }
}

// 3. Geting the transactions of etherium
module.exports.latestTransactions = async (req, res) => {

  const getLatestTransactions = async () => {
    const transactionHashs = []
    const transactions = []
    try {
      while (transactionHashs.length < 100) {
        const blockByNumber = await provider.send("eth_getBlockByNumber", ["pending", false]);
        transactionHashs.push(...blockByNumber.transactions)
      }
    
      for (let index = 0; index < 100; index++) {
        const tx = await provider.getTransaction(transactionHashs[index]);
        transactions.push(
          {
            transactionHash: tx?.hash,
            senderAddress: tx?.from,
            receiverAddress: tx?.to,
            amount: ethers.formatEther(tx?.value),
            blockNumber: tx?.blockNumber
          }
        )
      }
      return transactions
    } catch (error) {
      throw new Error('Failed to get transactions');
    }
  };

  const sortByEtherAmount = (transactions) => {
    return transactions.sort((a, b) => Number(b.amount) - Number(a.amount));
  };

  try {
    const transactions = await getLatestTransactions();
    const sortedTransactions = sortByEtherAmount(transactions);
    res.json({ transactions: sortedTransactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}