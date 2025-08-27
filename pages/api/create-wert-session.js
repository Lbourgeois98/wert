curl -X POST "https://partner.wert.io/api/external/hpp/create-session" \
-H "X-Api-Key: 776572742d70726f642d33343733656162352d653566312d343363352d626535312d616531336165643361643539" \
-H "Content-Type: application/json" \
-d '{
  "flow_type": "simple_full_restrict",
  "wallet_address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "currency": "BTC",
  "network": "bitcoin",
  "currency_amount": 100.50
}'
