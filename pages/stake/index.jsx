import { ethers } from "ethers"
import { useWallet } from "@gimmixorg/use-wallet"
import { parse, format, toWei, fromWei } from "../../util/number.js"
import { useState, useEffect, useRef } from "react"
import ActionInput from "../../components/ActionInput.jsx"
import classNames from "classnames"
import useStaking from "../../state/useStaking.js"
import useBalance from "../../state/useBalance.js"
import deployments from "../../config/deployments.json"

const BN = n => ethers.BigNumber.from(n)


const Stat = ({ title, value, center }) => (
	<>
		<div className="stat-container col">
			<div className="title">{title}</div>
			<div className="stat">{value}</div>
		</div>

		<style jsx>{`
			.stat-container {
				gap: 2px;
				align-items: ${center ? "center" : "flex-start"}
			}

			.title {
				font-weight: 600;
				font-size: 1.5em;
			}

			.stat {
				font-size: 1.3em;
			}
		`}</style>
	</>
)

const Stake = () => {
	const { account, provider } = useWallet()
	const StakingPool = useStaking(account, provider.getSigner())
	const [stakeActive, setStakeActive] = useState(true)

	return (
		<>
			<div className="staking-container col center-a">
				<div className="staking-grid">
					<div className="stats card staking-card col evenly">
						<div className="card-title">stats</div>
						<Stat title="FRIES staked" value={format(parse(StakingPool.friesStaked, 18), 2)} />
						<Stat title="FRIES balance" value={format(parse(StakingPool.friesBalance, 18), 2)} />
						<Stat title="all FRIES staked" value={format(parse(StakingPool.allFriesStaked, 18), 2)} />
						<Stat title="circulating KCHUP" value={format(parse(StakingPool.totalKchupFarmed, 18), 2)} />
					</div>

					<div className="stake card staking-card col center-a center-m">
						<div className="stake-options select-title row">
							<button className={classNames("stake-option", "button", {
								primary: !stakeActive,
								secondary: stakeActive,
							})} onClick={() => setStakeActive(true)}>stake</button>
							<button className={classNames("stake-option", "button", {
								primary: stakeActive,
								secondary: !stakeActive,
							})} onClick={() => setStakeActive(false)}>unstake</button>
						</div>

						{stakeActive ? (
							<ActionInput key="stake" actionName="stake" token={{
								name: "FRIES",
								decimals: 18,
								displayDecimals: 2,
								address: deployments.fries
							}} action={StakingPool.stake} approve={deployments.stakingPool} account={account} signer={provider.getSigner()} max={StakingPool.friesBalance} />
						) : (
							<ActionInput key="unstake" actionName="unstake" token={{
								name: "FRIES",
								decimals: 18,
								displayDecimals: 2,
								address: deployments.fries
							}} action={StakingPool.unstake} account={account} signer={provider.getSigner()} max={StakingPool.friesStaked} />
						)}


					</div>

					<div className="harvest card staking-card col evenly">
						<div className="card-title">harvest</div>
						<Stat center title="KCHUP harvestable" value={format(parse(StakingPool.kchupHarvestable, 18), 2)} />
						<button className={classNames("harvest-action", "primary", {
							disabled: StakingPool.kchupHarvestable.isZero()
						})} onClick={StakingPool.harvest}>harvest KCHUP</button>
					</div>
				</div>
			</div>
			<style jsx>{`
				.staking-container {
					height: 100%;
					width: 100%;
					padding: 40px 20px;
					overflow: auto;
				}

				.staking-grid {
					margin: auto;
					display: grid;
					grid-template-columns: repeat(10, 1fr);
					grid-template-rows: repeat(6, 1fr);
					max-width: 800px;
					width: 100%;
					height: 400px;
					gap: 20px;
				}

				.stats {
					grid-area: 1 / 1 / 7 / 5;
				}

				.stake {
					grid-area: 1 / 5 / 4 / 11;
				}

				.harvest {
					grid-area: 4 / 5 / 7 / 11;
				}

				.staking-card {
					position: relative;
					border-top-color: var(--orange);
					border-top-width: 3px;
					padding: 36px 40px 24px 40px;
				}

				.card-title {
					position: absolute;
					font-size: 1.4em;
					top: -1px;
					left: 50%;
					transform: translateX(-50%);
					background-color: var(--accent);
					color: var(--white);
					border: 1px solid var(--accent);
					padding: 0 16px;
					border-radius: 0 0 var(--border-radius) var(--border-radius);
					font-weight: 600;
				}

				.select-title {
					position: absolute;
					top: -1px;
					left: 50%;
					padding: 0px 4px 2px 4px;
					transform: translateX(-50%);
					background-color: var(--accent);
					color: var(--bg);
					border: 1px solid var(--accent);
					border-radius: 0 0 var(--border-radius) var(--border-radius);
				}

				.harvest-action {
					font-size: 1.3em;
					padding: 6px 0;
					width: 100%;
				}

				.stake-option {
					padding: 0 16px;
					font-size: 1.4em;
					transition: 0.25s color, 0.25s background-color, 0.25s border-color;
				}

				@media only screen and (max-width: 900px) {
					.staking-container {
						font-size: 12px;
					}

					.staking-grid {
						max-width: 600px;
						height: 300px;
					}

					.staking-card {
						padding: 36px 24px 16px 24px;
					}
				}

				@media only screen and (max-width: 720px) {
					.staking-grid {
						max-width: 350px;
						height: 900px;
					}
					
					.stats {
						grid-area: 3 / 1 / 7 / 11;
					}
	
					.stake {
						grid-area: 1 / 1 / 3 / 11;
					}
	
					.harvest {
						grid-area: 7 / 1 / 7 / 11;
					}
				}
			`}</style>
		</>
	)
}

export default Stake