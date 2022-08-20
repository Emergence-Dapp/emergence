import React from "react";
import {useState} from "react";
import {
  useHMSActions,
  useHMSStore,
  selectPeers,
  selectLocalPeer,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectPermissions,
  selectIsLocalScreenShared,
} from "@100mslive/react-sdk";

import {ethers} from "ethers"; 
import Semaphore from "../../pages/utils/Semaphore.json";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
const { generateProof } =require("@semaphore-protocol/proof");
const { verifyProof } = require("@semaphore-protocol/proof");
const { packToSolidityProof } = require("@semaphore-protocol/proof");
import 'dotenv/config'



function Controls({ switches }) {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const stage = localPeer.roleName === "stage";
  const peers = useHMSStore(selectPeers);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const isLocalScreenShared = useHMSStore(selectIsLocalScreenShared);
  let toggler = false;

  const [proof,setProof] = useState();
  const [externalNullifier,setExternalNullifier] = useState();
  // const [signal,setSignal] = useState();
  const [identityCommitment,setIdentityCommitment] = useState();

  const TEST_NET_PRIVATE_KEY = process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY;
  console.log(TEST_NET_PRIVATE_KEY);
  console.log(process.env);
  const SemaphoreABI = Semaphore.abi;
  const SempahoreAddress ="0x7a9aBb8C43916a9Ddcf9307e0664aC37A822a0Aa";
  const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/0aWYomtIkhZ7DpFAZtNasdu74nL_ZlMf");
  const signer = new ethers.Wallet(TEST_NET_PRIVATE_KEY).connect(provider);
  const admin = '0xd770134156f9aB742fDB4561A684187f733A9586';

  //1.Have the hashed identity + signed from backend
  const signal = "Hello ZK";
  const signalBytes32 = ethers.utils.formatBytes32String(signal);
  //2.Have the ExternalNullifier as the roomId



  const semaphoreContract = new ethers.Contract(SempahoreAddress,SemaphoreABI,signer);


  const SwitchAudio = async () => {
    //toggle audio enabled
    await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
  };
  const ScreenShare = async () => {
    //toggle screenshare enabled
    await hmsActions.setScreenShareEnabled(!isLocalScreenShared);
  };
  const SwitchVideo = async () => {
    //toggle video enabled
    await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
  };

  const ExitRoom = () => {
    hmsActions.leave();
    //exit a room
  };

  const permissions = useHMSStore(selectPermissions);

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

  async function onHandleGenerateProof(){
    //Connect to Identity
    const newIdentity = new Identity("signal message");
    const newTrapdoor = newIdentity.getTrapdoor();
    const newNullifier = newIdentity.getNullifier();
    const newIdentityCommitment = newIdentity.generateCommitment();
    console.log(newIdentity);
    console.log(newIdentityCommitment);
    setIdentityCommitment(newIdentityCommitment);

    //Generate Group
    const group = new Group();
    group.addMember(newIdentityCommitment);

    //Generate Proof

    const localExternalNullifier = group.root
    // const signal = "proposal_1"

    const fullProof = await generateProof(newIdentity, group, localExternalNullifier, signal, {
        zkeyFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.zkey",
        wasmFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.wasm"
    })
    // Fetch Verification Key
    const verificationKey = await fetch("https://www.trusted-setup-pse.org/semaphore/20/semaphore.json").then(function(res) {
      return res.json();
    });

    //Verify Proof OffChain
    const res = await verifyProof(verificationKey, fullProof) // true or false.



    console.log(fullProof);
    console.log(res);



  }

  async function onHandleCreateGroup(){
    console.log("Create Group");
    const groupId2 = 1001
    const createGroup = await semaphoreContract.createGroup(groupId2,20,0,admin);
    console.log(createGroup);
    // let tx1 = await createGroup.wait()
    // console.log(tx1);

    // const addMember = await semaphoreContract.addMember(groupId2,identityCommitment);
    // tx1 = await addMember.wait()
  }

  async function onHandleAddMember(){
    console.log("Add Member")
    console.log(identityCommitment);
    const addMember = await semaphoreContract.addMember(999,identityCommitment);
    tx1 = await addMember.wait()
  }

  async function onHandleVerifyOnChain(){
    console.log("On Chain Verification Tx");
    const groupId2 = 1000
    const localExternalNullifier = 100002;
    const newIdentity = new Identity("signal message");
    const newIdentityCommitment = newIdentity.generateCommitment();

    const group = new Group();
    group.addMember(newIdentityCommitment);

    
   
    console.log(group)
    console.log("Group Root")
    console.log(group.root)
   

    const fullProof = await generateProof(newIdentity, group, localExternalNullifier, signal, {
      zkeyFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.zkey",
      wasmFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.wasm"
  })

    const { nullifierHash } = fullProof.publicSignals
    const solidityProof = packToSolidityProof(fullProof.proof)
    console.log("Solidity Proof");
    console.log(solidityProof);

    console.log("signalBytes");
    console.log(signalBytes32);



    const checkMembership = await semaphoreContract.verifyProof(999,signalBytes32,nullifierHash,localExternalNullifier,solidityProof);
    const tx = await checkMembership.wait();

    console.log(tx);
  }

  return (
    <div className=" w-full h-full flex flex-row gap-2 justify-center items-center text-white font-semibold">
      <button
        className=" uppercase px-5 py-2 hover:bg-blue-600"
        onClick={SwitchVideo}
      >
        {isLocalVideoEnabled ? "Off Video" : "On Video"}
      </button>
      <button
        className=" uppercase px-5 py-2 hover:bg-blue-600"
        onClick={SwitchAudio}
      >
        {isLocalAudioEnabled ? "Off Audio" : "On Audio"}
      </button>
      <button
            className=" uppercase px-5 py-2 hover:bg-blue-600"
            onClick={ExitRoom}
          >
            Exit Meeting
          </button>
          <button
            className=" uppercase px-5 py-2 hover:bg-blue-600"
            onClick={ExitRoom}
          >
            Request Funds
          </button>
          <button
          className=" uppercase px-5 py-2 hover:bg-blue-600"
          onClick={onHandleGenerateProof}
        >
          Generate Proof
        </button>
        <button
            className=" uppercase px-5 py-2 hover:bg-blue-600"
            onClick={ExitRoom}
          >
            StartRoom
          </button>
          <button
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
          </button>
          <button
            className=" uppercase px-5 py-2 hover:bg-blue-600"
            onClick={onHandleVerifyOnChain}
          >
            Verify On Chain
          </button>
    </div>
  );
}

export default Controls;
