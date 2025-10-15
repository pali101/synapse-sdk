import type { Config } from '@wagmi/cli'
import type { Abi, Address } from 'viem'
import { fetchContractAbi } from './src/script/abi-fetcher.ts'

const network = process.env.NETWORK === 'mainnet' ? 'mainnet' : 'calibration'
const chainId = network === 'mainnet' ? 314 : 314159

const createConfig = async (): Promise<Config[]> => {
  const contracts = [
    {
      name: 'Payments',
      isProxy: false,
      address: {
        314: '0x7DaE6F488651ec5CEE38c9DFbd7d31223eAe1DDE' as Address,
        314159: '0x6dB198201F900c17e86D267d7Df82567FB03df5E' as Address,
      },
    },
    {
      name: 'FilecoinWarmStorageService',
      isProxy: true,
      address: {
        314: '0x0000000000000000000000000000000000000000' as Address,
        314159: '0x468342072e0dc86AFFBe15519bc5B1A1aa86e4dc' as Address,
      },
    },
    {
      name: 'FilecoinWarmStorageServiceStateView',
      isProxy: false,
      address: {
        314: '0x0000000000000000000000000000000000000000' as Address,
        314159: '0xE4587AAdB97d7B8197aa08E432bAD0D9Cfe3a17F' as Address,
      },
    },
    {
      name: 'PDPVerifier',
      isProxy: true,
      address: {
        314: '0x0000000000000000000000000000000000000000' as Address,
        314159: '0x579dD9E561D4Cd1776CF3e52E598616E77D5FBcb' as Address,
      },
    },
    // {
    //   name: 'ServiceProviderRegistry',
    //   isProxy: true,
    //   address: {
    //     314: '0x0000000000000000000000000000000000000000' as Address,
    //     314159: '0x1096ba1e7BB912136DA8524A22bF71091dc4FDd9' as Address,
    //   },
    // },
    // {
    //   name: 'SessionKeyRegistry',
    //   isProxy: false,
    //   address: {
    //     314: '0x0000000000000000000000000000000000000000' as Address,
    //     314159: '0x97Dd879F5a97A8c761B94746d7F5cfF50AAd4452' as Address,
    //   },
    // },
    {
      name: 'Usdfc',
      isProxy: true,
      address: {
        314: '0x80B98d3aa09ffff255c3ba4A241111Ff1262F045' as Address,
        314159: '0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0' as Address,
      },
    },
  ]

  // Filter addresses for the selected network
  const filteredContracts = contracts.map((contract) => ({
    ...contract,
    address: typeof contract.address === 'object' ? contract.address[chainId] : contract.address,
    chainId,
  }))

  // Fetch all ABIs upfront
  const contractsWithAbis = await Promise.all(
    filteredContracts.map(async (contract) => {
      const result = await fetchContractAbi({
        name: contract.name,
        address: contract.address as Address,
        chainId: contract.chainId,
        isProxy: contract.isProxy,
      })
      return {
        name: contract.name,
        address: contract.address as Address,
        abi: JSON.parse(result.body) as Abi,
      }
    })
  )

  return [
    {
      out: 'src/abis/gen.ts',
      contracts: contractsWithAbis,
      plugins: [],
    },
  ]
}

export default createConfig
