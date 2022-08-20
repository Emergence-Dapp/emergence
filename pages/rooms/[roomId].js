import Head from "next/head";

import Login from "../../components/Login";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import { Header } from "../../components/Header";
import { useRouter } from "next/router";


export default function Rooms() {
    const router = useRouter();
    const {roomId} = router.query

  return (
    <HMSRoomProvider>
    <div>
      <Head>
        <title>Emergence</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Login roomId={roomId} />
    </div>
    </HMSRoomProvider>
  );
}
