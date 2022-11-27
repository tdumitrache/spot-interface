import React from 'react';
import { AccessTokenManager } from '@elrondnetwork/dapp-core-internal';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks/account/useGetAccountInfo';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core/hooks/account/useGetLoginInfo';
import { maiarIdApi } from 'config';

export const AccessTokenWrapper = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { address } = useGetAccountInfo();
  const { isLoggedIn, loginMethod, tokenLogin } = useGetLoginInfo();

  return (
    <AccessTokenManager
      loggedIn={isLoggedIn}
      loginMethod={loginMethod}
      userAddress={address}
      tokenLogin={tokenLogin}
      maiarIdApi={maiarIdApi}
    >
      {children}
    </AccessTokenManager>
  );
};
