// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const {
    body: { type, data },
    method
  } = req
  
  if (method == 'POST') {
    if (type === 'room.end.success') {
      const videoUrl = data.URL;
      console.log({ videoUrl });
      console.log('room ended...');
      return res.status(200).send('success');
    }
  }

  res.status(200).send('nothing here');
}
