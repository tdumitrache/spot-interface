import React, { FC } from 'react';

import { hooks, services } from '@elrondnetwork/dapp-core-internal';
import { SwapAuthorizationProvider } from '@elrondnetwork/dapp-core-swap/components/SwapAuthorizationProvider';
import { SwapApiAddressEnum } from '@elrondnetwork/dapp-core-swap/types/SwapApiAddress.enum';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks/account/useGetAccountInfo';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core/hooks/account/useGetLoginInfo';
import { maiarIdApi, timeout } from 'config';

export const ApolloWrapper: FC<{ children?: React.ReactNode }> = ({
  children
}) => {
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();
  const { accessToken } = hooks.useGetIsAuthenticated(
    address,
    maiarIdApi,
    isLoggedIn
  );

  const getAccessToken = async () => {
    if (accessToken) {
      return Promise.resolve(accessToken ?? '');
    }

    try {
      const tokenData = await services.maiarId.getAccessToken({
        address,
        maiarIdApi,
        timeout
      });

      return tokenData?.accessToken;
    } catch (e) {
      console.error(e);
      return Promise.resolve(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFkZHJlc3MiOiJlcmQxOHg2a3d1MmZ2bTdtcjVlc3J5MmpyNDBtOWdnNnRoMGZ5aGFscTZqa3JuZnBtZnlqeXNocTJqMHd1NyIsImlkIjo0MTA4NH0sImRhdGEiOnt9LCJpYXQiOjE2Njk0OTQ4MDUsImV4cCI6MTY2OTkyNjgwNSwiaXNzIjoiaWQubWFpYXIuY29tIiwic3ViIjoiZXJkMTh4Nmt3dTJmdm03bXI1ZXNyeTJqcjQwbTlnZzZ0aDBmeWhhbHE2amtybmZwbWZ5anlzaHEyajB3dTcifQ.TxEe_-k_XpYz2ckBxFF8YkDj0rR8PSST9Q8yiIHocig'
      );
    }
  };

  return (
    <SwapAuthorizationProvider
      apiAddress={SwapApiAddressEnum.DEVNET_API_ADDRESS}
      getAccessToken={getAccessToken}
    >
      {children}
    </SwapAuthorizationProvider>
  );
};
