import { ethers } from "ethers"
import useRaise from "../../state/useRaise"
import { useWallet } from "@gimmixorg/use-wallet"
import { parse, format, toWei, fromWei } from "../../util/number.js"
import project from "../../config/project.json"
import classNames from "classnames"
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

const RaisePage = () => {
	const { provider, account } = useWallet()
	const Raise = useRaise(account, provider.getSigner())

	return (
		<>
			<div className="raise-container col center-a">
				<div className="raise-inner col center-a">
					<div className="raised">
						<div className="amount">${format(Raise.raiseStats.totalRaised, 2)} raised</div>
					</div>
					<div className="raise-card-grid">
						<div className="raise-card card stats col between">
							<div className="card-title">stats</div>
							<div className="stats-list col between">
								<Stat title="raise duration" value={`${Raise.raiseStats.duration} days`} />
								<Stat title="tokens distributed" value={`${format(Raise.raiseStats.raiseAllocationFries)} FRIES`} />
								<Stat title="unique contributors" value={`${Raise.raiseStats.uniqueAddresses} addresses`} />
								<Stat title="avg. contribution" value={`$${format(Object.values(Raise.allContributions).reduce((acc, i) => acc + i, 0) / Raise.allAddresses.length)}`} />
							</div>
						</div>

						<div className="raise-card card col between">
							<div className="card-title">contributions</div>
							<div className="contributions-list col">
								{Raise.allAddresses.sort((a1, a2) => Raise.allContributions[a2] - Raise.allContributions[a1]).map((address) =>
								(<>
									<a href={`${project.explorer}/address/${address}`} target="_blank" className="contribution-container row between">
										<div className="contributor-address">{`${address.slice(0, 5)}...${address.slice(-3)}`}</div>
										<div className="contributor-amount">${format(Raise.allContributions[address], 2)}</div>
									</a>
								</>)
								)}
							</div>
						</div>

						<div className="raise-card card">
							<div className="card-title">claim</div>
							<div className="claim-container col center-a center-m">
								<Stat center title="pending FRIES" value={format(parse(Raise.claimable))} />
								{/* <div className="pending-title">pending FRIES</div>
							<div className="pending-tokens">{format(parse(Raise.claimable))}</div> */}
								<button className={classNames("claim", "primary", {
									disabled: Raise.claimable.isZero()
								})} onClick={Raise.claim}>claim FRIES</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.raise-container {
					width: 100%;
					height: 100%;
					padding: 40px 20px;
					overflow: auto;
				}

				.raise-inner {
					width: 100%;
					gap: 24px;
					margin: auto;
				}

				.raised {
					font-size: 2.75rem;
					font-weight: 700;
					text-align: center;
				}

				.raise-card-grid {
					display: grid;
					grid-template-columns: 5fr 6fr 5fr;
					grid-template-rows: 1fr;
					width: 100%;
					max-width: 1000px;
					height: 350px;
					gap: 20px;
				}

				.raise-card {
					height: 350px;
					gap: 12px;
					position: relative;
					border-top-color: var(--orange);
					border-top-width: 3px;
					padding: 48px 36px 24px 36px;
				}

				.raise-panel {
					padding: 20px 40px;
				}

				.card-title {
					position: absolute;
					font-size: 1.4em;
					top: -1px;
					left: 50%;
					transform: translateX(-50%);
					background-color: var(--accent);
					color: var(--bg);
					border: 1px solid var(--accent);
					padding: 0 16px;
					border-radius: 0 0 var(--border-radius) var(--border-radius);
					font-weight: 600;
				}

				.stats-list {
					height: 100%;
				}

				.contributions-list {
					overflow: auto;
					padding-right: 6px;
					font-size: 1.1em;
					gap: 8px;
				}

				.contribution-container {
					border-bottom: 1px solid var(--gray);
				}

				.pending-title {
					font-size: 1.4em;
					font-weight: bold;
				}

				.pending-tokens {
					font-size: 1.3em;
					font-weight: 600;
				}

				.claim {
					font-size: 1.4em;
					padding: 8px 20px;
				}

				.claim-container {
					height: 90%;
					gap: 20px;
				}

				@media only screen and (max-width: 1150px) {
					.raise-inner {
						font-size: 12px;
					}

					.raise-card-grid, .raise-card {
						height: 250px;
						max-width: 750px;
					}

					.raise-card {
						padding: 36px 24px 24px 24px;
					}
				}

				@media only screen and (max-width: 850px) {
					.raised {
						font-size: 2.75em;
					}

					.raise-inner {
						height: unset;
					}

					.raise-card-grid {
						grid-template-columns: 1fr;
						grid-template-rows: 1fr 1fr 1fr;
						max-width: 250px;
						height: unset;
					}					
				}
			`}</style>
		</>
	)
}

export default RaisePage