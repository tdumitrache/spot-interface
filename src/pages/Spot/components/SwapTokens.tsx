import React from 'react';

import { useAuthorizationContext } from '@elrondnetwork/dapp-core-swap/components/SwapAuthorizationProvider/context/AuthorizationContext';
import { useTokens } from '@elrondnetwork/dapp-core-swap/hooks/useTokens';
import { EsdtType } from '@elrondnetwork/dapp-core-swap/types';
import { Loader } from '@elrondnetwork/dapp-core/UI/Loader';
import styles from './swap.module.scss';
import { SwapForm } from './SwapForm';

const { container } = styles;

export const SwapTokens = () => {
  const [firstToken, setFirstToken] = React.useState<EsdtType>({
    balance: '',
    decimals: 0,
    name: '',
    identifier: '',
    ticker: '',
    owner: ''
  });
  const [secondToken, setSecondToken] = React.useState<EsdtType>({
    balance: '',
    decimals: 0,
    name: '',
    identifier: '',
    ticker: '',
    owner: ''
  });

  const { isAuthenticated } = useAuthorizationContext();

  const { getTokens, tokens, isTokensLoading } = useTokens({
    onlySafeTokens: true
  });

  React.useEffect(() => {
    getTokens();
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (tokens) {
      const egldToken = tokens.find((token) => token.ticker === 'WEGLD');
      setSecondToken(egldToken);

      const usdcToken = tokens.find((token) => token.ticker === 'USDC');

      setFirstToken(usdcToken);
    }
  }, [tokens]);

  return (
    <div className={container}>
      {isTokensLoading ? (
        <div className='d-flex justify-center align-center h-100'>
          <Loader noText />
        </div>
      ) : (
        <>
          <SwapForm
            firstTokenToSwap={firstToken}
            secondTokenToSwap={secondToken}
            isBuying
          />
          <SwapForm
            firstTokenToSwap={secondToken}
            secondTokenToSwap={firstToken}
            isBuying={false}
          />
        </>
      )}
    </div>
  );
};
