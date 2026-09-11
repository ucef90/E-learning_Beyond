export async function api(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`/api/v1${path}`, {
    method,
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(
      Array.isArray(data?.message)
        ? data.message.join(" · ")
        : data?.message || `Demande impossible (${res.status}).`,
    );
  return data;
}
export function download(
  name: string,
  data: unknown,
  type = "application/json",
) {
  const blob = new Blob(
    [typeof data === "string" ? data : JSON.stringify(data, null, 2)],
    { type },
  );
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export function canLeaveNotebook() {
  return window.dispatchEvent(
    new Event("notebook-before-leave", { cancelable: true }),
  );
}
