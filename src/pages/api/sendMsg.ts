import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server"; // Import client creation function
import pusherEventHandler from "@/pages/api/pusher"; // If you're using Pusher

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { content, conversation_id } = req.body;

    try {
        // Initialize the Supabase client within the request scope
        const supabase = await createClient(); // Create client here

        // Get the authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Fetch the user's first name
        const { data: profile, error: profileError } = await supabase
            .from("accounts")
            .select("first_name")
            .eq("id", user.id)
            .single();

        if (profileError) {
            throw new Error("Error fetching user profile");
        }

        // Insert the message into the database
        const { data: message, error: messageError } = await supabase
            .from("messages")
            .insert([{ content, conversation_id, sender_id: user.id }])
            .select("*")
            .single();

        if (messageError) {
            throw new Error("Error inserting message");
        }

        // Trigger Pusher event
        const eventData = {
            sender_id: user.id,
            content,
            first_name: profile?.first_name,
        };

        const response = await fetch("/api/pusher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ channel: "stryv-test-development", event: "new-message", data: eventData }),
        });

        if (!response.ok) {
            throw new Error(`Failed to trigger Pusher event: ${response.statusText}`);
        }

        res.status(200).json({ message: "Message sent successfully", data: message });
    } catch (error: any) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}
