import { supabase } from "@/lib/supabase";

export type EventType = {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
};

const GOOGLE_CALENDAR_API_URL =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export const insertEvent = async (event: EventType) => {
  const token = await getAccessToken();
  // console.log("token", token);
  try {
    const response = await fetch(GOOGLE_CALENDAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Function to get access token
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      // console.log(response);
      throw new Error(`Error inserting event: ${response?.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error inserting event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await fetch(`${GOOGLE_CALENDAR_API_URL}/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`, // Function to get access token
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting event: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    // console.error("Error deleting event:", error);
    throw error;
  }
};

export const importEvents = async () => {
  try {
    const response = await fetch(GOOGLE_CALENDAR_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`, // Function to get access token
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items; // Assuming the events are in the 'items' array
  } catch (error) {
    // console.error("Error importing events:", error);
    throw error;
  }
};

const getAccessToken = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check for provider_token in user meta_data
  let providerToken = user?.user_metadata?.provider_token;
  // console.log("user met", user?.user_metadata);
  if (!providerToken) {
    // If not found, check the session for provider_token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.provider_token) {
      // Update user meta_data with provider_token and provider_refresh_token
      providerToken = session.provider_token;
      const providerRefreshToken = session.provider_refresh_token;

      await supabase.auth.updateUser({
        data: {
          provider_token: providerToken,
          provider_refresh_token: providerRefreshToken,
        },
      });
    }
  }

  // console.log("provider_token", providerToken);
  return providerToken; // Return the provider_token
};
