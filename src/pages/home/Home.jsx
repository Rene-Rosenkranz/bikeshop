import { Card, Typography } from "@mui/material";
import React from "react";

export default function Home() {
  return (
    <Card style={{ padding: "200px", margin: "auto" }}>
      <Typography
        variant="h4"
        component="h3"
        style={{
          padding: "25px",
          margin: "auto",
          color: "rgb(0, 0, 0)",
        }}
      >
        Bikeshop SCS Tool
      </Typography>
      <Typography>
        Planen Sie hier ihre Produktion. Beginnen Sie bei "Simulation über XML
        Datei", um die aktuellen Informationen hochzuladen. Dort können Sie dann
        auf Basis der Prognosen ihr Produktionsprogramm festlegen. Danach sehen
        in dem Reiter "Simulation" die vorgeschlagenen Bestell- und
        Produktionsprogramme.
      </Typography>
    </Card>
  );
}
