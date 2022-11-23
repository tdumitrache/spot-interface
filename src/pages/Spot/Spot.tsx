import React from 'react';

import { Chart, TransactionsHistory, SwapTokens } from './components';

const Spot = () => {
  return (
    <div className='py-4' style={{ backgroundColor: 'rgb(30, 32, 38)' }}>
      <div className='row m-2'>
        <div className='col-12 col-md-10'>
          <div className='d-flex flex-column'>
            <div className='mb-2'>
              <Chart />
            </div>
            <div className='w-100 h-100'>
              <SwapTokens />
            </div>
          </div>
        </div>
        <div className='col-12 col-md-2'>
          <TransactionsHistory />
        </div>
      </div>
    </div>
  );
};

export default Spot;
