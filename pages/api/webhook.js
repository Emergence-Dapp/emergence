
import aws from 'aws-sdk';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import uuid4 from 'uuid4';


const getManagementKey = () => {
    return new Promise((resolve, reject) => {
        var app_access_key = '62f6449dc16640065697182c';
        var app_secret = 'ojJPdgjgjI4DMT4btFGjGazgighCn4rBhiNh9XvpKgpW8ZP4aa7XGEtOF35OTzounnQDqekMiyXAfBXh1BfgQg1zGZR6HvKd4OdrnqP1u4Q2VVew6UbmaER9I9G1cssLb5mhNjeap8420nWP5TghtdjyD4t4wQ3EO8Z5JUGdQno=';

        const payload = {
            access_key: app_access_key,
            type: 'management',
            version: 2,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000)
        };

        jwt.sign(
            payload,
            app_secret,
            {
                algorithm: 'HS256',
                expiresIn: '24h',
                jwtid: uuid4()
            },
            function(err, token) {
                if (err) {
                    reject(err);
                }
                resolve(token);
            }
        );
    });

}

export default async function handler(req, res) {
  const {
    body: { type, data },
    method,
  } = req


    console.log({ method, type, data });
    if (method == 'POST') {
        if (type == 'recording.success') {
            const videoUrl = data.URL;
            console.log('recording.success');
            console.log({ videoUrl, data });
            return res.status(200).send('success');
        } else if (type == 'recording.failed') {
            console.log('recording.failed');
            console.log({ data });
            return res.status(200).send('success');
        } else if (type == 'session.open.success') {
            const authKey = await getManagementKey()
            console.log({ authKey });
            const options = {
                method: 'POST',
                url: 'https://prod-in2.100ms.live/api/v2/beam',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authKey
                },
                data: {
                    operation: 'start',
                    room_id: '63004db6b1e780e78c3bc4ff',
                    meeting_url: 'https://videodemo.app.100ms.live/preview/63004db6b1e780e78c3bc4ff/stage?skip_preview=true',
                    record: true,
                    resolution: { width: 1280, height: 720 }
                }
            };

            try {
                const resp = await axios.request(options);
                console.log({ data: resp.data });
            } catch (err) {
                console.log('stopping beam failed')
            }
            return res.status(200).send('meeting started');
        } else if (type == 'session.close.success') {
            const authKey = await getManagementKey()
            const options = {
                method: 'POST',
                url: 'https://prod-in2.100ms.live/api/v2/beam',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authKey
                },
                data: {
                    operation: 'stop',
                    room_id: '63004db6b1e780e78c3bc4ff',
                }
            };

            try {
                const resp = await axios.request(options);
                console.log({ data: resp.data });
            } catch (err) {
                console.log('stopping beam failed')
            }
            return res.status(200).send('meeting stoped');
        } else if (type == 'beam.recording.success') {
            console.log({ location: data.location });
        }

    }
  }

  res.status(200).send('nothing here')
}
