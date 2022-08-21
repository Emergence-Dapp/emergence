import React, { useState } from 'react'
import { FlowingBalance } from '../FlowingBalance'
import {
  useHMSActions,
  useHMSStore,
  selectPeers,
  selectLocalPeer,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectPermissions,
  selectIsLocalScreenShared,
} from '@100mslive/react-sdk'

import { ethers } from 'ethers'
import Semaphore from '../../pages/utils/Semaphore.json'
import SFRouter from '../../pages/utils/SFRouter.json'

import { Identity } from '@semaphore-protocol/identity'
import { Group } from '@semaphore-protocol/group'
import 'dotenv/config'
const { generateProof } = require('@semaphore-protocol/proof')
const { verifyProof } = require('@semaphore-protocol/proof')
const { packToSolidityProof } = require('@semaphore-protocol/proof')

function Controls({ switches }) {
  const hmsActions = useHMSActions()
  // const localPeer = useHMSStore(selectLocalPeer)
  // const stage = localPeer.roleName === 'stage'
  // const peers = useHMSStore(selectPeers)
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled)
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled)
  // const isLocalScreenShared = useHMSStore(selectIsLocalScreenShared)
  // const toggler = false

  const [globalSolidityProof, setGlobalSolidityProof] = useState()
  const [globalExternalNullifier, setGlobalExternalNullifier] = useState(1)
  const [globalNullifierHash, setGlobalNullifierHash] = useState()
  // const [signal,setSignal] = useState();
  const [identityCommitment, setIdentityCommitment] = useState()
  const [videoRoomId, setVideoRoomId] = useState(1)

  const [roomId, setRoomId] = useState()

  // setSignalBytes32 set signal?

  const TEST_NET_PRIVATE_KEY =
    '41be2237573f80b4aa4a36292600f4f68f0805b0fb73491ec82dc69872313dfb'
  const provider = new ethers.providers.JsonRpcProvider(
    'https://polygon-mumbai.infura.io/v3/c975e1fb176d4b199e55a8180be5e1dd',
  )
  const signer = new ethers.Wallet(TEST_NET_PRIVATE_KEY).connect(provider)
  const admin = '0x60d7D6097E5b63A29358EB462E95078f0deD78bd'

  // 1.change this for ConnectWallet
  const SemaphoreABI = Semaphore.abi
  const SempahoreAddress = '0x7a9aBb8C43916a9Ddcf9307e0664aC37A822a0Aa'

  const semaphoreContract = new ethers.Contract(
    SempahoreAddress,
    SemaphoreABI,
    signer,
  )

  const SFRouterABI = SFRouter.abi
  const SFRouterAddress = '0xb9DD495145Dd77663894616Ee74b204126d26ae5'
  const sfRouterContract = new ethers.Contract(
    SFRouterAddress,
    SFRouterABI,
    signer,
  )

  // 1.Have the hashed identity + signed from backend
  const signal = 'Hello ZK'
  const signalBytes32 = ethers.utils.formatBytes32String(signal)
  // 2.Have the ExternalNullifier as the roomId

  // 3.Sign Message

  const SwitchAudio = async () => {
    // toggle audio enabled
    await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)
  }

  const SwitchVideo = async () => {
    // toggle video enabled
    await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled)
  }

  const ExitRoom = () => {
    hmsActions.leave()
  }

  const permissions = useHMSStore(selectPermissions)

  // const endRoom = async () => {
  //   //end the meeting
  //   try {
  //     const lock = false; // A value of true disallow rejoins
  //     const reason = "Meeting is over";
  //     await hmsActions.endRoom(lock, reason);
  //   } catch (error) {
  //     // Permission denied or not connected to room
  //     console.error(error);
  //   }
  // };

  async function onHandleStartRoom() {
    console.log('create Room')
    // set VideoRoomId;
    const startRoom = await sfRouterContract.createRoom({ gasLimit: 1500000 })
    const tx = startRoom.wait()
    console.log(startRoom)
    console.log(tx)
    setVideoRoomId(1)
    setGlobalExternalNullifier(1)
    // Set room Id
  }

  async function onHandleGenerateProof() {
    // Connect to Identity
    const newIdentity = new Identity('signal message')
    // const newTrapdoor = newIdentity.getTrapdoor();
    // const newNullifier = newIdentity.getNullifier();
    const newIdentityCommitment = newIdentity.generateCommitment()
    console.log(newIdentity)
    console.log(newIdentityCommitment)

    // Generate Group
    const group = new Group()
    group.addMember(newIdentityCommitment)

    // Generate Proof

    const localExternalNullifier = 1
    // const signal = "proposal_1"

    const fullProof = await generateProof(
      newIdentity,
      group,
      localExternalNullifier,
      signal,
      {
        zkeyFilePath:
          'https://www.trusted-setup-pse.org/semaphore/20/semaphore.zkey',
        wasmFilePath:
          'https://www.trusted-setup-pse.org/semaphore/20/semaphore.wasm',
      },
    )
    const { nullifierHash } = fullProof.publicSignals
    const solidityProof = packToSolidityProof(fullProof.proof)

    // Fetch Verification Key
    const verificationKey = await fetch(
      'https://www.trusted-setup-pse.org/semaphore/20/semaphore.json',
    ).then(function (res) {
      return res.json()
    })

    // Verify Proof OffChain
    const res = await verifyProof(verificationKey, fullProof) // true or false.
    console.log(fullProof)
    console.log(res)

    setGlobalSolidityProof(solidityProof)
    setGlobalNullifierHash(nullifierHash)
  }

  // async function onHandleVerifyOnChain() {
  //   console.log('On Chain Verification Tx')

  //   const checkMembership = await semaphoreContract.verifyProof(
  //     999,
  //     signalBytes32,
  //     globalNullifierHash,
  //     globalExternalNullifier,
  //     globalSolidityProof,
  //     { gasLimit: 1500000 },
  //   )
  //   console.log(checkMembership)
  //   const tx = await checkMembership.wait()

  //   console.log(tx)
  // }

  async function onHandleStartFlow() {
    console.log('On StartFlow Tx')
    console.log(sfRouterContract)
    // uint256 groupdId,
    // bytes32 signal,
    // uint256 nullifierHash,
    // uint256 externalNullifier,
    // uint256[8] calldata proof,
    // // bytes32 signedMessage,
    // uint256 roomId,
    // ISuperfluidToken token,
    // address receiver

    const superFluidToken = '0x91a6eCDe40B04dc49522446995916dCf491C37E4'

    const startFlowTransaction = await sfRouterContract.sendTransaction(
      999,
      signalBytes32,
      globalNullifierHash,
      1,
      globalSolidityProof,
      1,
      superFluidToken,
      { gasLimit: 1500000 },
    )
    console.log(startFlowTransaction)
    const tx = await startFlowTransaction.wait()

    console.log(tx)
  }

  async function onHandleCreateGroup() {
    console.log('Create Group')
    const groupId2 = 1001
    const createGroup = await semaphoreContract.createGroup(
      groupId2,
      20,
      0,
      admin,
    )
    console.log(createGroup)
    // let tx1 = await createGroup.wait()
    // console.log(tx1);

    // const addMember = await semaphoreContract.addMember(groupId2,identityCommitment);
    // tx1 = await addMember.wait()
  }

  // async function onHandleAddMember() {
  //   console.log('Add Member')
  //   console.log(identityCommitment)
  //   const addMember = await semaphoreContract.addMember(999, identityCommitment)
  //   tx1 = await addMember.wait()
  // }

  return (
    <div className=" w-full h-full flex flex-row gap-2 justify-center items-center text-white font-semibold">
      <button
        className=" uppercase px-5 py-2 hover:bg-blue-600"
        onClick={SwitchVideo}
      >
        {isLocalVideoEnabled ? 'Off Video' : 'On Video'}
      </button>
      <button
        className=" uppercase px-5 py-2 hover:bg-blue-600"
        onClick={SwitchAudio}
      >
        {isLocalAudioEnabled ? 'Off Audio' : 'On Audio'}
      </button>
      <button
        className=" uppercase px-5 py-2 hover:bg-blue-600"
        onClick={ExitRoom}
      >
        Exit Meeting
      </button>
      <button
        className=" uppercase px-5 py-2 hover:bg-blue-600"
        onClick={onHandleStartRoom}
      >
        Open Room
      </button>
      {globalSolidityProof ? (
        <button
          className=" uppercase px-5 py-2 hover:bg-blue-600"
          onClick={onHandleStartFlow}
        >
          Start Flow
        </button>
      ) : (
        <button
          className=" uppercase px-5 py-2 hover:bg-blue-600"
          onClick={onHandleGenerateProof}
        >
          Generate Proof
        </button>
      )}

      {/* <FlowingBalance /> */}
      {/* <button
            className=" uppercase px-5 py-2 hover:bg-blue-600"
            onClick={onHandleCreateGroup}
          >
            Create Group
          </button>
          <button
            className=" uppercase px-5 py-2 hover:bg-blue-600"
            onClick={onHandleAddMember}
          >
            AddMember
          </button> */}
      {/* <button
            className=" uppercase px-5 py-2 hover:bg-blue-600"
            onClick={onHandleVerifyOnChain}
          >
            Verify On Chain
          </button> */}
    </div>
  )
}

export default Controls
