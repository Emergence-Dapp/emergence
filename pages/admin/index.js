import { Header } from "../../components/Header";
import {axios} from "axios";

// const axios = require("axios");
  
const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "57c79d44298443588fe6f4e29249633c",
        "content-type": "application/json",
    },
});
assembly
    .post("/transcript", {
        audio_url: "https://bit.ly/3yxKEIY"
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));


export default function AdminPage() {
  return (
    <div>{ res }</div>
    );
}