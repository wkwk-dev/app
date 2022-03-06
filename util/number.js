import { ethers } from "ethers"
const BN = n => ethers.BigNumber.from(n)

function parse(num, decimals = 18) {
    const padded = num.toString().padStart(decimals + 1, "0")
    const parsed = `${padded.slice(0, -decimals)}.${padded.slice(-decimals)}`.replace(/0+$/g, "")
    return parsed.endsWith(".") ? parsed.slice(0, -1) : parsed
}

function format(num, decimals = 2) {
    let parts = num.toString().split(".")
    
    if (parts[1] !== undefined) {
        parts[1] = (parts[1].length < decimals ? parts[1].padEnd(decimals, "0") : parts[1].slice(0, decimals))
    } else {
        parts[1] = new Array(decimals + 1).join("0")
    }

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join(".")
}

function toWei(num, dec) {
    return num.mul(BN(10).pow(BN(dec)))
}

function fromWei(num, dec) {
    return num.div(BN(10).pow(BN(dec)))
}

export { parse, format, toWei, fromWei }