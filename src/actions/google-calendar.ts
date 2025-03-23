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
  const token = await getAccessToken();
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of current week
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 30); // End of current week
  const startOfNextWeek = new Date(endOfWeek);
  startOfNextWeek.setDate(startOfNextWeek.getDate() + 1); // Start of next week
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(endOfNextWeek.getDate() + 7); // End of next week

  const timeMin = startOfWeek.toISOString();
  const timeMax = endOfNextWeek.toISOString();

  try {
    const response = await fetch(
      `${GOOGLE_CALENDAR_API_URL}?timeMin=${timeMin}&timeMax=${timeMax}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Function to get access token
        },
      }
    );

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
    data: { session },
  } = await supabase.auth.getSession();

  // Check for provider_token in session
  let providerToken = session?.provider_token;
  const providerRefreshToken = session?.provider_refresh_token;

  if (providerToken) {
    await supabase.auth.updateUser({
      data: {
        provider_token: providerToken,
        provider_refresh_token: providerRefreshToken,
      },
    });
  }

  if (!providerToken) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check for provider_token in user meta_data
    providerToken = user?.user_metadata?.provider_token;
  }

  return providerToken; // Return the provider_token
};
