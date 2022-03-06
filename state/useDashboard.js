import { ethers } from "ethers"
import { useState, useEffect } from "react"
const BN = n => ethers.BigNumber.from(n)
import ERC20ABI from "../abis/ERC20.json"
import StakingPoolABI from "../abis/FriesDAOStakingPool.json"
import axios from "axios"
import deployments from "../config/deployments.json"

function useDashboard(account, signer) {
    const FRIES = new ethers.Contract(deployments.fries, ERC20ABI, signer)
	const KCHUP = new ethers.Contract(deployments.kchup, ERC20ABI, signer) 
	const USDC = new ethers.Contract(deployments.usdc, ERC20ABI, signer) 
	const StakingPool = new ethers.Contract(deployments.stakingPool, StakingPoolABI, signer) 


	const [ friesBalance, setFriesBalance ] = useState(BN(0))
	const [ kchupBalance, setKchupBalance ] = useState(BN(0))
	const [ treasuryUsdc, setTreasuryUsdc ] = useState(BN(0))
	const [ treasuryFries, setTreasuryFries ] = useState(BN(0))
	const [ friesStaked, setFriesStaked ] = useState(BN(0))
	const [ kchupHarvestable, setKchupHarvestable ] = useState(BN(0))
	const [ totalKchupFarmed, setTotalKchupFarmed ] = useState(BN(0))
	const [ friesPrice, setFriesPrice ] = useState(0)

	useEffect(() => {
		update()
		const updateInterval = setInterval(update, 5000)

		return () => {
			clearInterval(updateInterval)
		}
	}, [])

	async function update() {
		const [
			_friesPrice,
			_friesBalance,
			_kchupBalance,
			_treasuryUsdc,
			_treasuryFries,
			_friesStaked,
			_kchupHarvestable,
			_unharvestedKchup,
			_totalKchup
		] = await Promise.all([
			axios.get("https://api.coingecko.com/api/v3/simple/price?ids=friesdao&vs_currencies=usd"),
			FRIES.balanceOf(account),
			KCHUP.balanceOf(account),
			USDC.balanceOf(deployments.treasury),
			FRIES.balanceOf(deployments.treasury),
			StakingPool.userInfo(0, account),
			StakingPool.pendingKCHUP(0, account),
			KCHUP.balanceOf(deployments.stakingPool),
			KCHUP.totalSupply()
		])
		setFriesPrice(_friesPrice.data.friesdao.usd)
		setFriesBalance(_friesBalance)
		setKchupBalance(_kchupBalance)
		setTreasuryUsdc(_treasuryUsdc),
		setTreasuryFries(_treasuryFries)
		setFriesStaked(_friesStaked[0])
		setKchupHarvestable(_kchupHarvestable)
		setTotalKchupFarmed(_totalKchup.sub(_unharvestedKchup))
	}
	
	function harvest() {
		const tx = StakingPool.deposit(0, 0)
		tx.then(txResponse => txResponse.wait()).then(update)

		return tx
	}

	return {
		friesPrice,
		friesBalance,
		kchupBalance,
		treasuryUsdc,
		treasuryFries,
		friesStaked,
		kchupHarvestable,
		totalKchupFarmed,
		harvest
	}
}

export default useDashboard