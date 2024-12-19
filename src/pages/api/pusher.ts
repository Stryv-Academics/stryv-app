import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { channel, event, data } = req.body;

        try {
            await pusher.trigger(channel, event, data);
            res.status(200).json({ message: "Event triggered successfully" });
        } catch (error) {
            console.error("Error triggering Pusher event:", error);
            res.status(500).json({ error: "Failed to trigger event" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
