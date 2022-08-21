// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';

export default function handler(req, res) {
    // fs.writeFileSync('hola.json', JSON.stringify({ a: 'b'}));
    const a = fs.readFileSync('hola.json');
    res.status(200).json({ name: 'John Doe', a })
}
