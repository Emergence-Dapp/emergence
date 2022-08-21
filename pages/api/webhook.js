import aws from 'aws-sdk';

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: 'us-east-2',
  signatureVersion: 'v4',
});

export default async function handler(req, res) {
    // const s3Client = new aws.S3();

    // const saveTranscriptions = (data) => {
    //     return new Promise((resolve, reject) => {
    //         s3Client.putObject({
    //             Bucket: 'emergence-dapp',
    //             Key: 'transcriptions.json',
    //             Body: data
    //         }, (err, res) => {
    //             if (err) {
    //                 return reject(err);
    //             }
    //             resolve(res);
    //         })
    //     })
    // };

    // const getTranscriptions = () => {
    //     return new Promise((resolve, reject) => {
    //         const searchParams = {
    //             Bucket: 'emergence-dapp',
    //             Key: 'transcriptions.json'
    //         };

    //         s3Client.getObject(searchParams, (err, data) => {
    //             if (err) {
    //                 return reject(err);
    //             }
    //             resolve(data.Body.toString());
    //         });
    //     });
    // };

    const {
        body: { type, data },
        method
    } = req

    console.log({ method, type });
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
        } else if (type == 'session.close.success') {
            // let indexData = '[]';
            // try {
            //     indexData = await getTranscriptions()
            //     console.log('getTranscriptions results', indexData);
            // } catch (err) {
            //     console.error('getTranscriptions failed');
            //     console.error({ err })
            // }

            // const indexDataObj = JSON.parse(indexData);
            // indexDataObj.push({ ...data });
            // try {
            //     await saveTranscriptions(JSON.stringify(indexDataObj));
            // } catch (err) {
            //     console.error('saveTranscriptions failed');
            //     console.error(err);
            // }

            // return res.status(200).json(indexDataObj);
        }
    }

    res.status(200).send('nothing here');
}
