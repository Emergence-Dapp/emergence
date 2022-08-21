import AWS from 'aws-sdk';
export default async function handler(req, res) {
    const accessKeyId = process.env.ACCESS_KEY;
    const secretAccessKey = process.env.SECRET_KEY;
    const s3Client = new AWS.S3(new AWS.Credentials({ accessKeyId, secretAccessKey }));

    const getTranscriptions = () => {
        return new Promise((resolve, reject) => {
            const searchParams = {
                Bucket: 'emergence-dapp',
                Key: 'transcriptions.json'
            };

            s3Client.getObject(searchParams, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data.Body.toString());
            });
        });
    };

    res.status(200).json(await getTranscriptions());
}
