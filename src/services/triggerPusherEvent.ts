export const triggerPusherEvent = async (
  channel: string,
  event: string,
  data: unknown //data is of type unknown but is not used, hence no error
) => {
  try {
    console.time("Send message execution time");
    const response = await fetch("/api/pusher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel, event, data }),
    });
    console.timeEnd("Send message execution time");

    if (!response.ok) {
      throw new Error(`Failed to trigger Pusher event: ${response.statusText}`);
    }

    console.log("Pusher event triggered successfully");
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
  }
};
