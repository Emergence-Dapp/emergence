import { React, useState, useEffect } from "react";
import { selectIsConnectedToRoom, useHMSActions, useHMSStore } from "@100mslive/react-sdk";
import Room from "./Room";
import { Identity } from "@semaphore-protocol/identity"


function Login() {

  function generateNewId(){
    const newIdentity = new Identity()
    const newTrapdoor = newIdentity.getTrapdoor();
    const newNullifier = newIdentity.getNullifier();
    const newIdentityCommitment = newIdentity.generateCommitment();


    console.log(newIdentity);
    console.log(newTrapdoor);
    console.log(newNullifier);
    console.log(newIdentityCommitment);


  }
  

  const endpoint = "https://prod-in2.100ms.live/hmsapi/videodemo.app.100ms.live/";
  
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState("");
  const [selectValues, setSelectValues] = useState("viewer");
  const isConnected = useHMSStore(selectIsConnectedToRoom)


  useEffect(() => {
    window.onunload = () => {
      hmsActions.leave();
    };
  }, [hmsActions]);

  const handleInputChange = (e) => {
    setInputValues(e.target.value);
  };
  const handleSelect = (e) => {
    setSelectValues(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fetchtoken = async () => {
      const response = await fetch(`${endpoint}api/token`, {
        method: "POST",
        body: JSON.stringify({
          user_id: "62f6449dc166400656971829",
          role: selectValues, //stage or viewers
          type: "app",
          room_id: "62f64a58b1e780e78c3b3fac",
        }),
      });
      const { token } = await response.json();
      return token;
    };
    const token = await fetchtoken(inputValues)
    hmsActions.join({
      userName: inputValues,
      authToken: token,
      settings: {
        isAudioMuted: true,
      },
    });
  };

  return (
    <>
    {!isConnected? (

    <div className=" h-screen flex justify-center items-center bg-slate-800">
      <div className=" flex flex-col gap-6 mt-8">
        <input
          type="text"
          placeholder="John Doe"
          value={inputValues}
          onChange={handleInputChange}
          className=" focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600"
        />
        <select
          type="text"
          placeholder="Select Role"
          value={selectValues}
          onChange={handleSelect}
          className=" focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600"
        >
          <option>stage</option>
          <option>viewer</option>
          </select>
        <button
          className="flex-1 text-white bg-blue-600 py-3 px-10 rounded-md"
          onClick={handleSubmit}
        >
          Join
        </button>
        <button
          className="flex-1 text-white bg-blue-600 py-3 px-10 rounded-md"
          onClick={generateNewId}
        >
          Create Idendity
        </button>


      </div>
    </div>
    ):(
    <Room/>
    )}
    </>
  );
}

export default Login;
