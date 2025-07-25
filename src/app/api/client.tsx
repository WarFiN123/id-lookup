export async function getDetails(
  discordID: string
): Promise<{ response: string }> {
  try {
    const response = tryUserLookup(discordID);
    return response;
  } catch (error) {
    return { response: "Error fetching user details" };
  }
}

async function tryUserLookup(discordID: string): Promise<{ response: string }> {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discordID }),
  });
  return response.json();
}
