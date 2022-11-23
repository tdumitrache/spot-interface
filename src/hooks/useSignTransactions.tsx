import { useState } from 'react';
import { useGetSignedTransactions } from '@elrondnetwork/dapp-core/hooks/transactions/useGetSignedTransactions';
import { sendTransactions } from '@elrondnetwork/dapp-core/services/transactions/sendTransactions';

export const useSignTransactions = () => {
  const [batchId, setBatchId] = useState('');
  const { signedTransactions: signedTransactionsDappCore } =
    useGetSignedTransactions();
  const batch = signedTransactionsDappCore[batchId];
  const signedTransactions = batch?.transactions || [];

  const handleSignTxs = async (transactions: Array<any>) => {
    const { error, sessionId: signedBatchId } = await sendTransactions({
      transactions,
      signWithoutSending: true
    });

    if (error || !signedBatchId) {
      console.error(error);
      return;
    }

    setBatchId(signedBatchId);

    return signedBatchId;
  };

  return { batchId, signedTransactions, handleSignTxs };
};
