import React from 'react';

import { SwapFormInputValidationErrorDisplay } from '@elrondnetwork/dapp-core-swap/components/SwapForm/SwapFormInputValidationErrorDisplay';
import { useSwapFormHandlers } from '@elrondnetwork/dapp-core-swap/hooks/useSwapFormHandlers';
import { useSwapRoute } from '@elrondnetwork/dapp-core-swap/hooks/useSwapRoute';
import { EsdtType } from '@elrondnetwork/dapp-core-swap/types';
import { meaningfulFormatAmount } from '@elrondnetwork/dapp-core-swap/utils/meaningfulFormatAmount';
import { useSwapValidationSchema } from '@elrondnetwork/dapp-core-swap/validation/hooks/useSwapValidationSchema';
import { useFormik } from 'formik';
import { useSignTransactions } from 'hooks';
import styles from './swap.module.scss';

const { inputContainer, input, btn, btnBuy, btnSell, errorDisplay } = styles;

interface SwapFormProps {
  firstToken: EsdtType;
  secondToken: EsdtType;
  isBuying: boolean;
}

export const SwapForm: React.FC<SwapFormProps> = ({
  firstToken: firstTokenToSwap,
  secondToken: secondTokenToSwap,
  isBuying
}) => {
  const [totalValue, setTotalValue] = React.useState<number>();
  const { handleSignTxs } = useSignTransactions();

  const { getSwapRoute, swapRoute, transactions } = useSwapRoute();

  const {
    firstToken,
    firstAmount,
    secondToken,
    secondAmount,
    handleOnChangeFirstAmount,
    handleOnChangeSecondAmount,
    handleOnChangeFirstSelect,
    handleOnChangeSecondSelect,
    handleOnChangeSwapRoute
  } = useSwapFormHandlers({
    getSwapRoute
  });

  const validationSchema = useSwapValidationSchema({
    minAcceptedAmount: 0,
    firstToken,
    secondToken
  });

  const onSubmit = () => {
    if (transactions) {
      handleSignTxs(transactions);
    }
  };

  const initialValues = {
    firstAmount: 0,
    firstToken,
    secondAmount: 0,
    secondToken,
    activeRoute: undefined
  };

  const {
    handleSubmit,
    handleBlur,
    handleChange,
    setFieldValue,
    setTouched,
    errors,
    touched
  } = useFormik<typeof initialValues>({
    onSubmit,
    initialValues,
    validationSchema
  });

  const resetSwapForm = () => {
    setTouched({}, false);
    setFieldValue('firstAmount', 0);
    setFieldValue('secondAmount', 0);
  };

  React.useEffect(() => {
    const firstTokenOption = {
      label: firstTokenToSwap?.identifier,
      value: firstTokenToSwap?.identifier,
      token: firstTokenToSwap
    };

    const secondTokenOption = {
      label: secondTokenToSwap?.identifier,
      value: secondTokenToSwap?.identifier,
      token: secondTokenToSwap
    };
    setFieldValue('firstToken', firstTokenOption);
    handleOnChangeFirstSelect(firstTokenOption);

    setFieldValue('secondToken', secondTokenOption);
    handleOnChangeSecondSelect(secondTokenOption);

    resetSwapForm();
  }, [firstTokenToSwap, secondTokenToSwap]);

  React.useEffect(() => {
    handleOnChangeSwapRoute(swapRoute);
  }, [swapRoute]);

  const firstAmountOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    handleChange(event);
    handleOnChangeFirstAmount(event.currentTarget.value);
    setTotalValue(Number(firstAmount) * Number(secondAmount));
  };

  const secondAmountOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    handleChange(event);
    handleOnChangeSecondAmount(event.currentTarget.value);
    setTotalValue(Number(firstAmount) * Number(secondAmount));
  };

  const handleOnChangeTotal = (event: React.FormEvent<HTMLInputElement>) => {
    setTotalValue(Number(event.currentTarget.value));
  };

  const balance = firstToken?.token
    ? meaningfulFormatAmount({
        amount: firstToken.token.balance ?? 0,
        decimals: firstToken?.token.decimals
      })
    : 0;

  console.log({ errors });

  return (
    <form className='d-flex flex-column' onSubmit={handleSubmit} noValidate>
      <div className='d-flex align-center mb-2'>
        <span className='text-secondary mr-2'>Avbl: </span>
        <span className='text-white font-weight-500'>{balance} USDC</span>
      </div>
      <div className='d-flex flex-column mb-2'>
        <div
          className={inputContainer}
          style={{
            border:
              errors.firstAmount && errors.firstAmount !== 'Token required'
                ? '0.5px solid red'
                : 'none'
          }}
        >
          <div className='d-flex align-center py-1 px-3 w-100'>
            <span className='text-secondary'>Price</span>
            <input
              type='number'
              min={0}
              name='firstAmount'
              className={input}
              value={
                Number(firstAmount) !== 0
                  ? Number(firstAmount).toFixed(2)
                  : firstAmount
              }
              onChange={firstAmountOnChange}
              onBlur={handleBlur}
            />
            <span className='text-white text-align-right'>USDC</span>
          </div>
        </div>
        <div className={errorDisplay}>
          <SwapFormInputValidationErrorDisplay
            fieldName={'firstAmount'}
            errors={errors}
            touched={touched}
          />
        </div>
      </div>
      <div className='d-flex flex-column mb-2'>
        <div
          className={inputContainer}
          style={{
            border:
              errors.secondAmount && errors.secondAmount !== 'Token required'
                ? '0.5px solid red'
                : 'none'
          }}
        >
          <div className='d-flex align-center py-1 px-3 w-100'>
            <span className='text-secondary'>Amount</span>
            <input
              type='number'
              min={0}
              name={'secondAmount'}
              className={input}
              value={
                Number(secondAmount) !== 0
                  ? Number(secondAmount).toFixed(2)
                  : secondAmount
              }
              onChange={secondAmountOnChange}
              onBlur={handleBlur}
            />

            <span className='text-white text-align-right'>EGLD</span>
          </div>
        </div>
        <div className={errorDisplay}>
          <SwapFormInputValidationErrorDisplay
            fieldName={'secondAmount'}
            errors={errors}
            touched={touched}
          />
        </div>
      </div>

      <div className={`${inputContainer} mt-4`}>
        <div className='d-flex align-center py-1 px-3 w-100'>
          <span className='text-secondary'>Total</span>
          <input
            type='number'
            min={0}
            className={input}
            value={totalValue?.toFixed(2)}
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
