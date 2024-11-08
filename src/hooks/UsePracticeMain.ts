import { useEffect, useState } from "react";
import { PracticeMain } from "../contracts/PracticeMain";
import { useTonClient } from "./UseTonClient";
import { useAsyncInitialize } from "./UseAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { UseTonConnect } from "./UseTonConnect";

export function UsePracticeMain() {
  const client = useTonClient();
  const { sender } = UseTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    entry_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();
  const [balance, setBalance] = useState<null | number>(0);

  const practiceMain = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new PracticeMain(
      Address.parse("EQBeGU2Av4hPhG99mBF6BJxKDBGKJJjJmcIz34EAs-6TQCYz") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<PracticeMain>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!practiceMain) return;
      setContractData(null);
      const val = await practiceMain.getStorageData();
      const balanceData = await practiceMain.getBalance();
      setContractData({
        entry_value : val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balanceData.number);
      await sleep (5000);
      getValue();
    }
    getValue();
  }, [practiceMain]);

  return {
    contract_address: practiceMain?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendDeposit : async () => {
        return practiceMain?.sendDeposit(sender,toNano("2"));
    },
    sendWithdrawalRequest : async () => {
      return practiceMain?.sendWithdrawalRequest(sender, toNano("0.05"), toNano("1"))
    }}
}