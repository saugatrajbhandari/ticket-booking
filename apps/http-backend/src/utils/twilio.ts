import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendMessage(to: string, body: string) {
  const message = await client.messages.create({
    body,
    from: "+16208371755",
    to,
  });

  console.log(message.body);
}
