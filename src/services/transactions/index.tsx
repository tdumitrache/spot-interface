import axios from 'axios';

const API_URL = 'https://api.elrond.com/accounts';

export const getLatestTransactions = async (address: string) => {
  const response = await axios.get(
    `${API_URL}/${address}/transactions?from=0&size=25&status=success`
  );

  return response.data;
};
