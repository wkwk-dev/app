import { ethers } from "ethers"
import { useState, useEffect } from "react"
import allContributions from "../data/allContributions.json"
import allAddresses from "../data/allAddresses.json"
import raiseStats from "../data/raiseStats.json"
import FriesDAOTokenSaleABI from "../abis/FriesDAOTokenSale.json"
import raiseConfig from "../config/raise.json"
import deployments from "../config/deployments.json"
const BN = n => ethers.BigNumber.from(n)


function useRaise(account, signer) {
	const Sale = new ethers.Contract(deployments.sale, FriesDAOTokenSaleABI, signer)

	const [ claimable, setClaimable ] = useState(BN(0))

	useEffect(() => {
		update()
		const updateInterval = setInterval(update, 5000)

		return () => {
			clearInterval(updateInterval)
		}
	}, [])

	async function update() {
		const [
			purchased,
			redeemed
		] = await Promise.all([
			Sale.purchased(account),
			Sale.redeemed(account)
		])

		setClaimable(purchased.sub(redeemed))
	}

	function claim() {
		const tx = Sale.redeemFries()
		tx.then(txResponse => txResponse.wait()).then(update)
		return tx
	}


	return {
		allContributions,
		allAddresses,
		raiseStats,
		claimable,
		Sale,
		claim
	}
}

export default useRaise