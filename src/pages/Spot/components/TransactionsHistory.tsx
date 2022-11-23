import React from 'react';

import { Loader } from '@elrondnetwork/dapp-core/UI/Loader';
import { getLatestTransactions } from 'services/transactions';
import styles from './transactions.module.scss';

interface IOrder {
  txHash: string;
  amount: number;
  price: number;
  time: string;
  isBuying: boolean;
}

const { container, flexItem } = styles;

export const TransactionsHistory = () => {
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchOrders = () => {
      setIsLoading(true);

      getLatestTransactions(
        'erd1qqqqqqqqqqqqqpgqeel2kumf0r8ffyhth7pqdujjat9nx0862jpsg2pqaq'
      ).then((transactions) =>
        setOrders(() =>
          transactions
            .filter(
              (transaction: any) => transaction.function !== 'removeLiquidity'
            )
            .map((transaction: any) => {
              const [token1, token2] = transaction.action.arguments.transfers;

              const isBuying = token1.ticker === 'USDC' ? true : false;
              const egldToken = {
                ...(token1.ticker === 'WEGLD' ? token1 : token2)
              };
              const usdcToken = {
                ...(token1.ticker === 'USDC' ? token1 : token2)
              };

              const amount = divideNumberByDecimals(
                parseInt(egldToken.value),
                egldToken.decimals
              );
              const price = divideNumberByDecimals(
                parseInt(usdcToken.value),
                usdcToken.decimals
              );

              const date = new Date(transaction.timestamp * 1000);
              const time = date.toTimeString().split(' ')[0];

              setIsLoading(false);

              return {
                price: price / amount,
                amount,
                time,
                isBuying,
                txHash: transaction.txHash
              };
            })
        )
      );
    };

    const divideNumberByDecimals = (number: number, decimals: number) => {
      let buffer = 1;

      for (let i = 0; i < decimals; i++) {
        buffer *= 10;
      }

      return number / buffer;
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 6000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={container}>
      <h4 className='text-white fw-bold mb-4'>Market Trades</h4>
      <div className='d-flex flex-column w-100 h-100'>
        <div className='d-flex w-100 mb-2'>
          <span className={`text-left text-secondary ${flexItem}`}>
            Price(USDC)
          </span>
          <span className={`text-right text-secondary ${flexItem}`}>
            Amount(EGLD)
          </span>
          <span className={`text-right text-secondary ${flexItem}`}>Time</span>
        </div>
        {isLoading ? (
          <div className='d-flex justify-center align-center h-100'>
            <Loader noText />
          </div>
        ) : (
          orders.map((order) => {
            return (
              <div className='d-flex w-100 mb-2' key={order.txHash}>
                <span
                  className={`text-left ${flexItem}`}
                  style={{
                    color: order.isBuying
                      ? 'rgb(14, 203, 129)'
                      : 'rgb(246, 70, 93)'
                  }}
                >
                  {order.price.toFixed(2)}
                </span>
                <span className={`text-right text-white ${flexItem}`}>
                  {order.amount.toFixed(2)}
                </span>
                <span className={`text-right text-white ${flexItem}`}>
                  {order.time}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
