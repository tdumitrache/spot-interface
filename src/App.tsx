import React from 'react';
import { EnvironmentsEnum } from '@elrondnetwork/dapp-core/types';
import {
  NotificationModal,
  SignTransactionsModals,
  TransactionsToastList
} from '@elrondnetwork/dapp-core/UI';
import { DappProvider } from '@elrondnetwork/dapp-core/wrappers';
import { AccessTokenWrapper } from 'components/AccessTokenWrapper';
import { ApolloWrapper } from 'components/ApolloWrapper';

import { Layout } from 'components';
import { network, walletConnectBridge } from 'config';
import { PageNotFound, Unlock } from 'pages';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { routeNames, routes } from 'routes';

export const App = () => {
  return (
    <Router>
      <DappProvider
        environment={EnvironmentsEnum.devnet}
        customNetworkConfig={{
          ...network,
          walletConnectBridgeAddresses: [walletConnectBridge]
        }}
      >
        <Layout>
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals className='custom-class-for-modals' />
          <AccessTokenWrapper>
            <ApolloWrapper>
              <Routes>
                <Route path={routeNames.unlock} element={<Unlock />} />
                {routes.map((route, index) => (
                  <Route
                    path={route.path}
                    key={'route-key-' + index}
                    element={<route.component />}
                  />
                ))}
                <Route path='*' element={<PageNotFound />} />
              </Routes>
            </ApolloWrapper>
          </AccessTokenWrapper>
        </Layout>
      </DappProvider>
    </Router>
  );
};
