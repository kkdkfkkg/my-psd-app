import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { 통장이름, 계좌번호, 최종잔고, "1번날짜":날짜1, "1번입출금명":명1, "1번입출금액":금액1, "1번잔고":잔고1 } = req.body;

  try {
    // 토큰 발급
    const tokenRes = await fetch("https://api.aspose.cloud/connect/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    });
    const { access_token } = await tokenRes.json();

    // PSD 레이어 수정 (예시: 통장이름만 교체)
    const updateRes = await fetch("https://api.aspose.cloud/v4.0/psd/dkdlvhs.psd/layers/textItems", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        { "Name": "통장이름", "Text": 통장이름 },
        { "Name": "계좌번호", "Text": 계좌번호 },
        { "Name": "최종잔고", "Text": 최종잔고 },
        { "Name": "1번날짜", "Text": 날짜1 },
        { "Name": "1번입출금명", "Text": 명1 },
        { "Name": "1번입출금액", "Text": 금액1 },
        { "Name": "1번잔고", "Text": 잔고1 }
      ])
    });
    const updateData = await updateRes.json();

    // PNG 변환
    const pngUrl = `https://api.aspose.cloud/v4.0/psd/dkdlvhs.psd/convert/png?token=${access_token}`;

    res.status(200).json({ updateData, pngUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}