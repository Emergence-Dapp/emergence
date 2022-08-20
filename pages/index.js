import Head from "next/head";
import styles from "../styles/Home.module.css";
import Login from "../components/Login";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import { Header } from "./components/Header";


export default function Home() {
  return (
    <HMSRoomProvider>
    <div>
      <Head>
        <title>Emergence</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Login />
    </div>
    </HMSRoomProvider>
  );
}
