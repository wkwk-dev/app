import { ethers } from "ethers"
import useRaise from "../../state/useRaise"
import { useWallet } from "@gimmixorg/use-wallet"
import { parse, format, toWei, fromWei } from "../../util/number.js"
import project from "../../config/project.json"
import classNames from "classnames"
const BN = n => ethers.BigNumber.from(n)


const NFTPage = () => {
	const { provider, account } = useWallet()

	return (
		<>

			<style jsx>{`
			
			`}</style>
		</>
	)
}

export default NFTPage