import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await client.connect();
        const db = client.db('student_management');
        const col = db.collection('students');

        if (req.method === 'GET') {
            const data = await col.find({}).toArray();
            return res.status(200).json(data.map(s => ({ ...s, id: s._id.toString() })));
        }

        if (req.method === 'POST') {
            await col.insertOne(req.body);
            return res.status(200).json({ status: 'success' });
        }

        if (req.method === 'DELETE') {
            await col.deleteOne({ _id: new ObjectId(req.query.id) });
            return res.status(200).json({ status: 'success' });
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
}