import axios from "axios";
import { useState, useEffect } from "react";

function useSign(account, signer) {
	const [ signed, setSigned ] = useState(false)

	function update() {
        if (account) {
            axios.get(`/api/checkSignature?address=${account}`).then(result => setSigned(result.data))
        }
    }

    useEffect(() => {
        update()
        const updateInterval = setInterval(update, 60000)

        return () => {
            clearInterval(updateInterval)
        }
    }, [account])

	function sign() {
		signer.signMessage("I agree to the friesDAO operating agreement").then((signedMessage) => {
			fetch('/api/createSignature', {
                body: JSON.stringify({
                    address: account,
                    signature: signedMessage
                }),
                method: 'POST'
            }).then(() => {
				setTimeout(() => {
					update()
				}, 500)
			})
		})
	}

    return {
		signed,
		sign
	}
}

export default useSign