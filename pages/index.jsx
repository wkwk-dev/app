import { useWallet } from "@gimmixorg/use-wallet"
import Chart from 'chart.js/auto'
import { ethers } from "ethers"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { Timeline } from 'react-twitter-widgets'
import colors from "../config/colors.json"
import project from "../config/project.json"
import useDashboard from "../state/useDashboard"
import { format, parse } from "../util/number.js"
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
				white-space: nowrap;
			}

			.stat {
				font-size: 1.3em;
				white-space: nowrap;
			}
		`}</style>
	</>
)

const Home = ({ theme }) => {
	const { account, provider } = useWallet()
	const Dashboard = useDashboard(account, provider.getSigner())
	const treasuryChartRef = useRef(null)

	useEffect(() => {
		Chart.defaults.font.family = project.googleFont;
		Chart.defaults.color = colors.raw[colors.elements[theme].text]
		const chartRef = treasuryChartRef.current.getContext("2d")

		const chart = new Chart(chartRef, {
			type: "doughnut",
			data: {
				labels: ["USDC", "FRIES"],
				datasets: [
					{
						label: "balance",
						data: [parse(Dashboard.treasuryUsdc, 6), parse(Dashboard.treasuryFries, 18) * Dashboard.friesPrice],
						backgroundColor: [
							colors.raw.usdc,
							colors.raw.orange
						]
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: false,
				plugins: {
					tooltip: {
						callbacks: {
							title: () => "Value in $"
						}
					}
				}
			}
		})

		return () => {
			chart.destroy();
		}
	}, [Dashboard.treasuryFries, Dashboard.friesPrice, Dashboard.treasuryUsdc])

	return (
		<>
			<div className="dashboard-container col center-a">
				<div className="dashboard-grid">
					<div className="treasury card dashboard-card">
						<div className="card-title">treasury</div>
						<div className="stat-chart-container row evenly">
							<div className="treasury-stats col center-a evenly">
								<Stat center title="USDC" value={`$${format(parse(Dashboard.treasuryUsdc, 6), 2)}`}
								/>
								<Stat center title="FRIES" value={`${format(parse(Dashboard.treasuryFries, 18), 2)}`} />
							</div>

							<div className="treasuryChart">
								<canvas ref={treasuryChartRef} />
							</div>
						</div>
					</div>

					<div className="staking card dashboard-card row center-a evenly">
						<div className="card-title">staking</div>
						<div className="staking-info-container col evenly">
							<Stat center title="your staked FRIES" value={format(parse(Dashboard.friesStaked, 18), 2)} />
							<Stat center title="KCHUP harvestable" value={format(parse(Dashboard.kchupHarvestable, 18), 2)} />
						</div>
						<div className="staking-actions col center-m center-a">
							<Link href="/stake">
								<a className="staking-action button primary">stake</a>
							</Link>
							<button className={classNames("staking-action", "primary", {
								disabled: Dashboard.kchupHarvestable.isZero()
							})} onClick={Dashboard.harvest}>harvest</button>
						</div>
					</div>

					<div className="twitter card dashboard-card col center-a center-m">
						<div className="card-title">announcements</div>
						<Timeline
							dataSource={{
								sourceType: 'profile',
								screenName: 'friesdao'
							}}
							options={{
								height: '100%',
								width: "100%",
								chrome: "noheader, nofooter",
								theme: theme
							}}
						/>
					</div>

					<div className="fries card dashboard-card col center-a evenly">
						<div className="card-title">FRIES</div>
						<Stat center title="balance" value={`${format(parse(Dashboard.friesBalance, 18), 2)}`}
						/>
						<Stat center title="circulating" value={`${format(243961218.3737563, 2)}`}
						/>
					</div>

					<div className="kchup card dashboard-card col center-a evenly">
						<div className="card-title">KCHUP</div>
						<Stat center title="balance" value={`${format(parse(Dashboard.kchupBalance, 18), 2)}`}
						/>
						<Stat center title="total farmed" value={`${format(parse(Dashboard.totalKchupFarmed, 18), 2)}`}
						/>
					</div>
				</div>
			</div>

			<style jsx>{`
				.dashboard-container {
					min-height: min-content;
					height: 100%;
					width: 100%;
					padding: 40px 10px;
					overflow: auto;
				}

				.stat-chart-container {
					width: 100%;
					height: 100%;
				}

				.treasury-stats {
					margin: 0 32px;
				}

				.treasuryChart {
					width: 200px;
					height: 100%;
				}
				
				.dashboard-grid {
					margin: auto;
					display: grid;
					grid-template-columns: 1fr 1fr 1fr 1fr;
					grid-template-rows: repeat(14, 1fr);
					max-width: 1000px;
					width: 100%;
					height: 500px;
					gap: 20px;
				}

				.treasury {
					grid-area: 1 / 1 / 9 / 3;
				}

				.staking {
					grid-area: 9 / 1 / 15 / 3;
					gap: 20px;
				}

				.twitter {
					grid-area: 1 / 3 / 9 / 5;
					overflow: hidden;
				}

				.fries {
					grid-area: 9 / 3 / 15 / 4
				}

				.kchup {
					grid-area: 9 / 4 / 15 / 5;
				}

				.community {
					grid-area: 12 / 1 / 15 / 3;
				}

				.dashboard-card {
					position: relative;
					border-top-color: var(--orange);
					border-top-width: 3px;
					padding: 36px 24px 16px 24px;
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

				.staking-actions {
					height: 100%;
					width: 40%;
					gap: 12px;
				}

				.staking-action {
					padding: 6px 20px;
					width: 100%;
					font-size: 1.5em;
				}

				@media only screen and (max-width: 1150px), only screen and (max-height: 600px) {
					.dashboard-grid {
						font-size: 12px;
						max-width: 800px;
						height: 400px;
					}
					
				}

				@media only screen and (max-width: 900px) {
					.dashboard-grid {
						max-width: 400px;
						height: 800px;
					}

					.treasury {
						grid-area: 5 / 1 / 9 / 5;
					}
	
					.staking {
						grid-area: 9 / 1 / 12 / 5;
						gap: 20px;
					}
	
					.twitter {
						grid-area: 1 / 1 / 5 / 5;
					}
	
					.fries {
						grid-area: 12 / 1 / 15 / 3
					}
	
					.kchup {
						grid-area: 12 / 3 / 15 / 5;
					}
				}

				@media only screen and (max-width: 500px) {
					.dashboard-grid {
						font-size: 10px;
						height: 600px;
						gap: 10px;
					}

					.treasuryChart {
						width: 150px;
					}

					.treasury-stats {
						margin: 0;
					}

					.staking-actions {
						gap: 4px;
					}

					.staking-action {
						padding: 6px 4px;
					}

					.staking {
						gap: 8px;
					}
				}
			`}</style>
		</>
	)
}

export default Home