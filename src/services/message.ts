import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Pusher from 'pusher';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Initialize Pusher client
const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
    secret: process.env.NEXT_PUBLIC_PUSHER_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    useTLS: true,
});

interface Message {
    id: number;
    user_id: string;
    content: string;
    created_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { user_id, content } = req.body;

        // Insert message into Supabase
        const { data, error } = await supabase
            .from<string, any>('messages') // Explicitly type the data
            .insert([{ user_id, content }])
            .select('*'); // Ensure the inserted data is returned

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (data && data.length > 0) {
            const message = data[0];

            // Trigger Pusher event to broadcast the new message
            await pusher.trigger('chat', 'new-message', {
                user_id: message.user_id,
                content: message.content,
                created_at: message.created_at,
            });

            return res.status(200).json({ message: 'Message sent!' });
        }

        return res.status(500).json({ error: 'Failed to retrieve inserted message' });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
