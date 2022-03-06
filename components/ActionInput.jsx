import classNames from "classnames"
import { useState, useRef, useEffect } from "react"
import useApproval from "../state/useApproval"
import { parse, format, toWei, fromWei } from "../util/number.js"
import { ethers } from "ethers"

const BN = n => ethers.BigNumber.from(n)


const ActionInput = ({actionName, token, max, action, approve, account, signer }) => {
	const [ buttonState, setButtonState ] = useState(0)
    const [ buttonText, setButtonText ] = useState(actionName)
	const [ value, setValue ] = useState(0)
	const [ lastModificationPercent, setLastModificationPercent ] = useState(0)
	const input = useRef(null)
	const approval = useApproval(account, signer, token.address)

	function buttonAction() {
        const stateActionMapping = {
            0: () => {},
            1: () => {
                approval.approve(approve)
            },
            2: () => {
                action(toWei(BN(value), token.decimals))
            }
        }

        stateActionMapping[buttonState]()
    }
		
	function updateButtonState() {
		console.log(value)
        if (isNaN(+value) || +value <= 0 || +value > max) {
            setButtonState(0)
        } else if (approve && toWei(BN((+value).toFixed()), token.decimals).gt(approval.allowance)) {
            setButtonState(1)
        } else {
            setButtonState(2)
        }
    }

	useEffect(() => {
        input.current.value = lastModificationPercent ? value.toFixed(token.displayDecimals) : (value !== 0 ? value : "")
        updateButtonState()
    }, [value])

	function inputUpdate() {
        setLastModificationPercent(false)
        setValue(input.current.value)
    }

	function percentUpdate(percent) {
		setLastModificationPercent(true)
		console.log(max)
		setValue((percent / 100) * max)
	}
	
	function updateButtonText() {
        const stateTextMapping = {
            0: () => actionName,
            1: () => "approve",
            2: () => actionName
        }

        setButtonText(stateTextMapping[buttonState]())
    }

	useEffect(() => {
        updateButtonText()
    }, [buttonState, actionName])

	return (
		<>
			<div className="action-input col">
				<div className="action-input-container row">
					<input ref={input} className="input rounded" placeholder={token.name} onInput={inputUpdate} />
					<button className={classNames("action", "primary", {
						disabled: buttonState === 0
					})} onClick={buttonAction}>{buttonText}</button>
				</div>

				<div className="percents row evenly">
					<button className="percent-button secondary" onClick={() => percentUpdate(25)}>25%</button>
					<button className="percent-button secondary" onClick={() => percentUpdate(50)}>50%</button>
					<button className="percent-button secondary" onClick={() => percentUpdate(55)}>75%</button>
					<button className="percent-button secondary" onClick={() => percentUpdate(100)}>100%</button>
				</div>
			</div>
			
			
			<style jsx>{`
				.input, .action {
					font-size: 1.6em;
					padding: 6px 12px;
				}

				.action-input {
					gap: 8px;
					width: 80%;
				}

				.action-input-container {
					width: 100%;
				}

				.input {
					border-top-right-radius: 0;
					border-bottom-right-radius: 0;
					border: 3px solid var(--accent);
					border-right-width: 0;
					flex: 1;
                    width: 100%;
					outline: none;
				}

				.action {
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
					border-left-width: 0;
				}

				.disabled {
					border-color: var(--accent) !important;
				}

				.percents {
					width: 100%;
				}

				.percent-button {
					font-size: 0.8em;
					padding: 2px 6px;
				}
			`}</style>
		</>
	)
}

export default ActionInput