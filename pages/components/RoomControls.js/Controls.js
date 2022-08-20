import React from "react";
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
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
const { generateProof } =require("@semaphore-protocol/proof")
const { verifyProof } = require("@semaphore-protocol/proof")
const { packToSolidityProof } = require("@semaphore-protocol/proof");


function Controls({ switches }) {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const stage = localPeer.roleName === "stage";
  const peers = useHMSStore(selectPeers);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const isLocalScreenShared = useHMSStore(selectIsLocalScreenShared);
  let toggler = false;

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

  async function generateNewId(){
    //Connect to Identity
    const newIdentity = new Identity()
    const newTrapdoor = newIdentity.getTrapdoor();
    const newNullifier = newIdentity.getNullifier();
    const newIdentityCommitment = newIdentity.generateCommitment();

    //Generate Group
    const group = new Group();
    group.addMember(newIdentityCommitment);

    //Generate Proof

    const externalNullifier = group.root
    const signal = "proposal_1"

    const fullProof = await generateProof(newIdentity, group, externalNullifier, signal, {
        zkeyFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.zkey",
        wasmFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.wasm"
    })
    //Fetch Verification Key
    const verificationKey = await fetch("https://www.trusted-setup-pse.org/semaphore/20/semaphore.json").then(function(res) {
      return res.json();
    });

    //Verify Proof OffChain
    const res = await verifyProof(verificationKey, fullProof) // true or false.



    console.log(fullProof);
    console.log(res);



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
          onClick={generateNewId}
        >
          Generate Proof
        </button>
        <button
            className=" uppercase px-5 py-2 hover:bg-blue-600"
            onClick={ExitRoom}
          >
            Verify Proof
          </button>
    </div>
  );
}

export default Controls;
