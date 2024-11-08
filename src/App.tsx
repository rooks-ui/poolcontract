import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { UsePracticeMain } from "./hooks/UsePracticeMain";
import { fromNano } from '@ton/ton';
import { UseTonConnect } from './hooks/UseTonConnect';

function App() {
  const {
    contract_address,
    entry_value,
    contract_balance,
    sendDeposit,
    sendWithdrawalRequest
  } = UsePracticeMain();

  const { connected } = UseTonConnect();

  return (
    <div>
      <div className='connect'>
        <TonConnectButton />
      </div>
      <br />
      <br />
      <div className='all'>
          <div className='Card'>
          <b>Smart contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          </div>

          <div className='Card'>
          <b>Smart Contract Balance</b>
          <br />
          {contract_balance && (
            <div className='Hint'>{fromNano(contract_balance)}</div>
          )}
          </div>

          <div className='Card'>
            <b>Pool Entries</b>
            <div>{entry_value ?? "Loading..."}</div>
          </div>

        </div>

        {
          connected && (
            <a onClick={() => (
              sendDeposit()
            )}>
              Enter Pool
            </a>
          )
        }
        <br />

        {
          connected && (
            <a onClick={() => (
              sendWithdrawalRequest()
            )}>
              Withdraw Rewards
            </a>
          )
        }

    </div>
  );
}

export default App
