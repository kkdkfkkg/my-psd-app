document.getElementById("updateForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const body = {};
  formData.forEach((v, k) => body[k] = v);

  const res = await fetch("/api/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  document.getElementById("result").innerHTML = data.pngUrl
    ? `<img src="${data.pngUrl}" style="max-width:500px">`
    : JSON.stringify(data);
});