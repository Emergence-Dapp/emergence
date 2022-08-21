import { Header } from "../../components/Header";
import axios from 'axios';

let transcriptId;
let status;
  
const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "57c79d44298443588fe6f4e29249633c",
        "content-type": "application/json",
    },
});

function getTranscriptResult() {
    assembly
    .get(`/transcript/${transcriptId}`)
    .then((res) => {
        console.log(res.data);
        status = res.data.status;
    })
    .catch((err) => console.error(err));
    if(status !== 'completed') {
        setTimeout(getTranscriptResult, 5000);        
    }
}

function postTranscriptForProcessing() {
    assembly
    .post("/transcript", {
        audio_url: "https://bit.ly/3yxKEIY"
    })
    .then((res) => {
        console.log(res.data);
        transcriptId = res.data.id;
        status = res.data.status;
    })
    .catch((err) => console.error(err));
    if(status !== 'completed') {
        setTimeout(getTranscriptResult, 5000);        
    }
}

postTranscriptForProcessing();

export default function AdminPage() {
  return (
    <div>
        <a className="btn-primary">Proceess Transcript</a>
    </div>
    );
}