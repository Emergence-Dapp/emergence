import { useEffect, useState } from 'react';
import { useWalletConnectClient } from '../contexts/ClientContext.jsx'

export const Header = () => {

    const { connect, signer, accounts } = useWalletConnectClient();
    const [signerAddress, setSignerAddress] = useState(null);
  
    useEffect(() => {
        (async() => {
        if(signer) setSignerAddress(await signer.getAddress())
        })()
    }, [signer])

    return (        
        <div className="mb-4">
            <div className="flex items-center justify-between m-6">
                <div className="float-left flex items-center">
                    <img src="/emergence-logo.png" className="w-10 mr-4 inline" alt="Emergence" />
                    <h1 className="text-brand-light text-3xl lowercase font-semibold tracking-tighter inline">Emergence</h1>
                </div>
                <div className="float-right">
                {
                    signer ? <span class="btn-secondary text-brand-light truncate w-44">{signerAddress}</span> : <button className="btn-secondary flex-row-reverse" onClick={connect}>connect</button>
                }
                </div>
            </div>
        </div>
    )
}

{/* <div className="mb-4">
    <div className="m-6">
        <div className="float-left flex items-center">
            <img src="/emergence-logo.png" className="w-10 mr-4 inline" alt="Emergence" />
            <h1 className="text-brand-light text-3xl lowercase font-semibold tracking-tighter inline">Emergence</h1>
        </div>
        <div className="float-right">
        {
            signer ? <span class="btn-secondary text-brand-light truncate w-44">{signerAddress}</span> : <button className="btn-secondary flex-row-reverse" onClick={connect}>connect</button>
        }
        </div>
    </div>
    <div className="clear-both"></div>
</div> */}
