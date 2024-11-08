import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type PracticeMainConfig = {
    number : number,
    address : Address,
    owner_address : Address
}

export function practiceMainConfigToCell(config: PracticeMainConfig): Cell {
    return beginCell()
    .storeUint(config.number, 64)
    .storeAddress(config.address)
    .storeAddress(config.owner_address)
    .endCell();
}

export class PracticeMain implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }) 
    {}

    static createFromAddress(address: Address) {
        return new PracticeMain(address);
    }

    static createFromConfig(config: PracticeMainConfig, code: Cell, workchain = 0) {
        const data = practiceMainConfigToCell(config);
        const init = { code, data };
        return new PracticeMain(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendDeposit(provider: ContractProvider, via: Sender, value: bigint ) {
        const msg_body = beginCell()
            .storeUint(1,32)
        .endCell()

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body:msg_body
        });
    }

    async sendWithdrawalRequest(provider: ContractProvider, via: Sender, value: bigint, amount: bigint ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(2,32)
            .storeCoins(amount)
            .endCell(),
        });
    }

    async sendChangeOwnerRequest(provider: ContractProvider, via: Sender, value: bigint, newOwner: Address ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(3,32)
            .storeAddress(newOwner)
            .endCell(),
        });
    }

    async getStorageData( provider: ContractProvider ) {
        const { stack} = await provider.get("get_contract_data", []);
        return {
            number: stack.readNumber(),
            recent_sender : stack.readAddress(),
            owner_address : stack.readAddress()
        };
    }

    async getBalance( provider: ContractProvider ) {
        const { stack} = await provider.get("balance", []);
        return {
            number: stack.readNumber(),
        };
    }
}
