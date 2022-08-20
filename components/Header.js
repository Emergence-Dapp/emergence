import { useWalletConnectClient } from '../contexts/ClientContext.jsx'

export const Header = () => {
    const { connect, signer } = useWalletConnectClient();
    return (
        <div className="inline-flex items-center m-6 ">
            <img src="/emergence-logo.png" className="w-10 mr-4" alt="Emergence" />
            <h1 className="text-brand-purple text-3xl lowercase font-semibold tracking-tighter">Emergence</h1>
            {
                signer ? 'connected' : <button className=" btn flex-1 text-white bg-blue-600 py-3 px-10 rounded-md" onClick={connect}>connect</button>
        }
        </div>
    )
}
