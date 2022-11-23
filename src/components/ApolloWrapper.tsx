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
      return '';
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
