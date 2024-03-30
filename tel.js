export async function genMessageFromData(data = []) {
  if (data.length == 0) return null;
  await messageToTelegram(`Scanned at ${new Date().toString().slice(0, 25)}\n`);
  data.forEach(async (el, i) => {
      let m = `${el.title}\n\n`;
      m += el.coins.map((c) => rowText(c));
      await messageToTelegram(m.replaceAll(",", ""));
  });
}
const rowText = (c) => {
  return `${c.name} (${c.symbol}) - ${c.price} ${c.up ? "up" : "down"} by ${
    c.percent
  }\n\n`;
};

export const messageToTelegram = async (message) => {
  const res = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        disable_notification: true,
        chat_id: process.env.TELEGRAM_CHANNEL,
        text: message,
      }),
    }
  );
  return res.status;
};
