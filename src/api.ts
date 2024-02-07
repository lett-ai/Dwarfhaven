let API: string = ''
/** Sets the API URL. */
export const setAPI = (url: string) => API = url

/** Sends a POST request to an endpoint under the API (set using setAPI). */
export const POST = async (endpoint: string, data: any, token: string) => {
  const s = await fetch(API + endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': "application/json",
      'x-access-token': token || ""
    }
  }).catch(e => console.error("Error in sending request:", e))
  if (!s) return null;
  if (s.status != 200) {
    const d = await s.json().catch(_ => _)
    console.error(
      "Server returned error. Code:", s.status, "& Data:", d
    )
    return {
      error: s.status,
      msg: d?.error ?? "No or invalid error message received."
    }
  }
  const d = await s.json().catch(e => console.error("Error when consuming JSON from server:", e))
  if (!d) return null;
  if (d.error) throw d.error
  return d
}

declare global {
  interface Window {
    POST: (endpoint: string, data: any, token: string) => Promise<any>
    setAPI: (url: string) => void
  }
}

window.POST = POST
window.setAPI = setAPI