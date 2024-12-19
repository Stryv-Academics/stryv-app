export const triggerPusherEvent = async (channel: string, event: string, data: any) => {
    try {
        const response = await fetch("/api/pusher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ channel, event, data }),
        });

        if (!response.ok) {
            throw new Error(`Failed to trigger Pusher event: ${response.statusText}`);
        }

        console.log("Pusher event triggered successfully");
    } catch (error) {
        console.error("Error triggering Pusher event:", error);
    }
};
