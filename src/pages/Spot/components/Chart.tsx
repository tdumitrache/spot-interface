import React from 'react';

import { AdvancedChart } from 'react-tradingview-embed';

export const Chart = () => {
  return <AdvancedChart widgetProps={{ theme: 'dark', symbol: 'WEGLDUSDC' }} />;
};
