const express = require("express");
const DataAccess = require("./dataAccess");
const ProviderService = require("./providerService");
const app = express();
const dataAccess = new DataAccess();
const port = 3500;

app.use(express.json());

app.get("/appointments", (req, res) => {
  let specialty = req.query.specialty;
  let date = req.query.date;
  let minScore = req.query.minScore;
  if (!specialty || !date || isNaN(date) || !minScore) {
    res.sendStatus(400);
    return;
  }
  const providerService = new ProviderService(dataAccess);
  res.send(providerService.getProviders(minScore, specialty, date));
});

app.post("/appointments", (req, res) => {
  if (!req.body) {
    res.sendStatus(400);
    return;
  }

  const providers = dataAccess.getData();
  const matchingOnes = providers.filter(
    (provider) => req.body.name.toLowerCase() === provider.name.toLowerCase()
  );
  const dateFilter = matchingOnes.filter((prov) =>
    dataAccess.isAvailableOnDates(prov.availableDates, req.body.date)
  );
  console.log(dateFilter);
  if (dateFilter.length > 0) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
