export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { key } = req.body;

    if (key === process.env.SECRET_KEY) {
        return res.status(200).json({ authorized: true });
    } else {
        return res.status(401).json({ authorized: false });
    }
}
