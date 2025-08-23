document.getElementById("openWidget").addEventListener("click", function () {
  const wertWidget = new WertWidget({  "partner_id": "01K0FHM9K6ATK1CYCHMV34Z0YG",
  "origin": "https://sandbox.wert.io",
  "extra": {
    "wallets": [
      {
        "name": "TT",
        "network": "amoy",
        "address": "0x0118E8e2FCb391bCeb110F62b5B7B963477C1E0d"
      },
      {
        "name": "ETH",
        "network": "sepolia",
        "address": "0x0118E8e2FCb391bCeb110F62b5B7B963477C1E0d"
      }
    ]
  }
}})

  });

  wertWidget.mount(); // Opens the popup
});
