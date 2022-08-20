import Head from "next/head";

import Login from "../../components/Login";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import { Header } from "../../components/Header";
import { useRouter } from "next/router";


export default function Room() {
    const router = useRouter();
    const {roomId} = router.query

  return (
    <HMSRoomProvider>
    <div>
      <Header />
        <Room/>
    </div>
    </HMSRoomProvider>
  );
}
