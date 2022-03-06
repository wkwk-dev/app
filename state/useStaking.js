import { ethers } from "ethers"
import { useState, useEffect } from "react"
const BN = n => ethers.BigNumber.from(n)
import ERC20ABI from "../abis/ERC20.json"
import StakingPoolABI from "../abis/FriesDAOStakingPool.json"
import deployments from "../config/deployments.json"

function useStaking(account, signer) {
    const FRIES = new ethers.Contract(deployments.fries, ERC20ABI, signer)
	const KCHUP = new ethers.Contract(deployments.kchup, ERC20ABI, signer) 
	const StakingPool = new ethers.Contract(deployments.stakingPool, StakingPoolABI, signer) 


	const [ friesBalance, setFriesBalance ] = useState(BN(0))
	const [ kchupBalance, setKchupBalance ] = useState(BN(0))
	const [ friesStaked, setFriesStaked ] = useState(BN(0))
	const [ allFriesStaked, setAllFriesStaked ] = useState(BN(0))
	const [ kchupHarvestable, setKchupHarvestable ] = useState(BN(0))
	const [ totalKchupFarmed, setTotalKchupFarmed ] = useState(BN(0))
	const [ poolStart, setPoolStart ] = useState(0)

	useEffect(() => {
		update()
		const updateInterval = setInterval(update, 5000)

		return () => {
			clearInterval(updateInterval)
		}
	}, [])

	async function update() {
		const [
			_friesBalance,
			_kchupBalance,
			_friesStaked,
			_kchupHarvestable,
			_unharvestedKchup,
			_totalKchup,
			_allFriesStaked
		] = await Promise.all([
			FRIES.balanceOf(account),
			KCHUP.balanceOf(account),
			StakingPool.userInfo(0, account),
			StakingPool.pendingKCHUP(0, account),
			KCHUP.balanceOf(deployments.stakingPool),
			KCHUP.totalSupply(),
			FRIES.balanceOf(deployments.stakingPool)
		])
		setFriesBalance(_friesBalance)
		setKchupBalance(_kchupBalance)
		setFriesStaked(_friesStaked[0])
		setKchupHarvestable(_kchupHarvestable)
		setTotalKchupFarmed(_totalKchup.sub(_unharvestedKchup)),
		setAllFriesStaked(_allFriesStaked)
	}
	
	function harvest() {
		const tx = StakingPool.deposit(0, 0)
		tx.then(txResponse => txResponse.wait()).then(update)

		return tx
	}


	function stake(amount) {
		const tx = StakingPool.deposit(0, amount)
		tx.then(txResponse => txResponse.wait()).then(update)

		return tx
	}

	function unstake(amount) {
		const tx = StakingPool.withdraw(0, amount)
		tx.then(txResponse => txResponse.wait()).then(update)

		return tx
	}

	return {
		friesBalance,
		kchupBalance,
		friesStaked,
		kchupHarvestable,
		totalKchupFarmed,
		allFriesStaked,
		harvest,
		stake,
		unstake
	}
}

export default useStaking