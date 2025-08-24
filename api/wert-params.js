import { signPayload } from "@wert-io/widget-initializer/utils";

export default function handler(req, res) {
  const privateKey = process.env.WERT_PRIVATE_KEY; // stored in Vercel Settings

  const payload = {
    partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
    address: "39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv",
    commodity: "BTC",
    network: "bitcoin",
  };

  const signedParams = {
    ...payload,
    signature: signPayload(payload, privateKey),
  };

  res.status(200).json(signedParams);
}
