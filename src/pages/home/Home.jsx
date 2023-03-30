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
        Bikeshop
      </Typography>
    </Card>
  );
}
