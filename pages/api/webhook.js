// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const {
    body: { type, data },
    method
  } = req
  
  if (method == 'POST') {
    if (type == 'recording.success') {
      const videoUrl = data.URL;
      console.log('recording.success');
      console.log({ videoUrl, data });
      return res.status(200).send('success');
    } else if (type == 'recording.failed') {
      console.log('recording.failes');
      console.log({ data });
      return res.status(200).send('success');
    }
  }

  res.status(200).send('nothing here');
}
