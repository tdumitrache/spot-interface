import React from 'react';

import { useSwapRoute } from '@elrondnetwork/dapp-core-swap/hooks/useSwapRoute';
import { EsdtType, SwapRouteType } from '@elrondnetwork/dapp-core-swap/types';
import {
  getTokenDecimals,
  meaningfulFormatAmount
} from '@elrondnetwork/dapp-core-swap/utils';
import { useSwapValidationSchema } from '@elrondnetwork/dapp-core-swap/validation/hooks/useSwapValidationSchema';
import { parseAmount } from '@elrondnetwork/dapp-core/utils';
import { useFormik } from 'formik';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSignTransactions } from 'hooks';
import styles from './swap.module.scss';

const { inputContainer, input, btn, btnBuy, btnSell } = styles;

interface SwapFormProps {
  firstTokenToSwap: EsdtType;
  secondTokenToSwap: EsdtType;
  isBuying: boolean;
}

export const SwapForm: React.FC<SwapFormProps> = ({
  firstTokenToSwap,
  secondTokenToSwap,
  isBuying
}) => {
  const [firstToken, setFirstToken] =
    React.useState<EsdtType>(firstTokenToSwap);
  const [secondToken, setSecondToken] =
    React.useState<EsdtType>(secondTokenToSwap);

  const [firstAmount, setFirstAmount] = React.useState<string>('');
  const [secondAmount, setSecondAmount] = React.useState<string>('');
  const [totalValue, setTotalValue] = React.useState<string>('');

  const { handleSignTxs } = useSignTransactions();

  const { getSwapRoute, swapRoute, transactions } = useSwapRoute();

  // initializing the form values and tokens, when the component first renders
  React.useEffect(() => {
    setFirstToken(firstTokenToSwap);
    setSecondToken(secondTokenToSwap);

    resetForm();
  }, [firstTokenToSwap, secondTokenToSwap]);

  React.useEffect(() => {
    handleOnChangeSwapRoute(swapRoute);
    setFieldValue('activeRoute', swapRoute);
  }, [swapRoute]);

  // we want the totalValue to change, whenever user is filling any of the inputs
  React.useEffect(() => {
    setTotalValue((Number(firstAmount) * Number(secondAmount)).toString());
  }, [firstAmount, secondAmount]);

  const validationSchema = useSwapValidationSchema({
    firstToken: {
      value: firstTokenToSwap?.identifier,
      label: firstTokenToSwap?.identifier,
      token: firstTokenToSwap
    },
    secondToken: {
      value: secondTokenToSwap?.identifier,
      label: secondTokenToSwap?.identifier,
      token: secondTokenToSwap
    }
  });

  const initialValues = {
    firstAmount: '',
    secondAmount: '',
    activeRoute: swapRoute
  };

  const onSubmit = () => {
    if (transactions) {
      handleSignTxs(transactions);
    }
    resetForm();
  };

  const { handleSubmit, handleBlur, setFieldValue, resetForm, errors } =
    useFormik<typeof initialValues>({
      onSubmit,
      initialValues,
      validationSchema
    });

  // once the swapRoute changes, the conversion between the tokens is done automatically
  const handleOnChangeSwapRoute = (route: SwapRouteType) => {
    if (!route) {
      return;
    }

    const { swapType, tokenInID, tokenOutID, amountIn, amountOut, pairs } =
      route;

    const isFixedInput = swapType === 0;
    const amount = isFixedInput ? amountOut : amountIn;
    const identifier = isFixedInput ? tokenOutID : tokenInID;
    const decimals = getTokenDecimals({ identifier, pairs });

    const amountToDisplayDenom = meaningfulFormatAmount({ amount, decimals });
    const shouldUpdateSecondAmount = isFixedInput && firstAmount;
    const shouldUpdateFirstAmount = !isFixedInput && secondAmount;

    if (shouldUpdateSecondAmount) {
      setSecondAmount(() => amountToDisplayDenom);
      setFieldValue('secondAmount', amountToDisplayDenom);
    }

    if (shouldUpdateFirstAmount) {
      setFirstAmount(() => amountToDisplayDenom);
      setFieldValue('firstAmount', amountToDisplayDenom);
    }
  };

  const firstAmountOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    const amount = event.currentTarget.value;
    setFirstAmount(() => amount);
    setFieldValue('firstAmount', amount);

    const tokenInID = firstToken?.identifier;
    const tokenOutID = secondToken?.identifier;
    const hasBothTokens = tokenInID && tokenOutID;

    if (amount === '' || !hasBothTokens) {
      return;
    }

    const decimals = firstToken.decimals;
    const amountIn = parseAmount(amount, decimals);

    getSwapRoute({
      amountIn,
      tokenInID,
      tokenOutID
    });
  };

  const secondAmountOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    const amount = event.currentTarget.value;
    setSecondAmount(() => amount);
    setFieldValue('secondAmount', amount);

    const tokenInID = firstToken?.identifier;
    const tokenOutID = secondToken?.identifier;
    const hasBothTokens = tokenInID && tokenOutID;

    if (amount === '' || !hasBothTokens) {
      return;
    }

    const decimals = secondToken.decimals;
    const amountOut = parseAmount(amount, decimals);

    getSwapRoute({
      amountOut,
      tokenInID,
      tokenOutID
    });
  };

  const handleOnChangeTotal = (event: React.FormEvent<HTMLInputElement>) => {
    setTotalValue(event.currentTarget.value);
    setSecondAmount((Number(totalValue) / Number(firstAmount)).toString());
  };

  const balance = firstToken
    ? meaningfulFormatAmount({
        amount: String(firstToken.balance) ?? 0,
        decimals: firstToken.decimals
      })
    : 0;

  return (
    <form className='d-flex flex-column' onSubmit={handleSubmit} noValidate>
      <div className='d-flex align-center mb-2'>
        <span className='text-secondary mr-2'>Avbl: </span>
        <span className='text-white font-weight-500'>
          {balance} {firstToken?.ticker ?? 'N/A'}
        </span>
      </div>
      <div className='d-flex flex-column mb-2'>
        <OverlayTrigger
          placement='top-end'
          overlay={<Tooltip>{errors.firstAmount}</Tooltip>}
          show={errors.firstAmount ? true : false}
        >
          <div
            className={inputContainer}
            style={{
              border: errors.firstAmount ? '0.5px solid red' : 'none'
            }}
          >
            <div className='d-flex align-center py-1 px-3 w-100'>
              <span className='text-secondary'>Price</span>
              <input
                type='number'
                name='firstAmount'
                className={input}
                value={firstAmount}
                onChange={(e) => {
                  firstAmountOnChange(e);
                }}
                onBlur={handleBlur}
              />
              <span className='text-white text-align-right'>USDC</span>
            </div>
          </div>
        </OverlayTrigger>
      </div>
      <div className='d-flex flex-column mb-2'>
        <OverlayTrigger
          placement='top-end'
          show={errors.secondAmount ? true : false}
          overlay={<Tooltip>{errors.secondAmount}</Tooltip>}
        >
          <div
            className={inputContainer}
            style={{
              border: errors.secondAmount ? '0.5px solid red' : 'none'
            }}
          >
            <div className='d-flex align-center py-1 px-3 w-100'>
              <span className='text-secondary'>Amount</span>
              <input
                type='number'
                name={'secondAmount'}
                className={input}
                value={secondAmount}
                onChange={(e) => {
                  secondAmountOnChange(e);
                }}
                onBlur={handleBlur}
              />

              <span className='text-white text-align-right'>EGLD</span>
            </div>
          </div>
        </OverlayTrigger>
      </div>

      <div className={`${inputContainer} mt-4`}>
        <div className='d-flex align-center py-1 px-3 w-100'>
          <span className='text-secondary'>Total</span>
          <input
            type='number'
            className={input}
            value={totalValue}
            onChange={handleOnChangeTotal}
          />
          <span className='text-white text-align-right'>USDC</span>
        </div>
      </div>

      <button
        type='submit'
        className={`${btn} ${isBuying ? btnBuy : btnSell} mt-2`}
      >
        {isBuying ? 'Buy' : 'Sell'} EGLD
      </button>
    </form>
  );
};
