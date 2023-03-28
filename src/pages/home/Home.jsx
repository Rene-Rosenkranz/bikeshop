import { Card, Typography } from "@mui/material";
import React from "react";

function Home() {
  return (
    <>
      <Card>
        <Typography
          variant="h4"
          component="h3"
          style={{ padding: "50px", margin: "auto", color: "rgb(120, 69, 17)" }}
        >
          Ja moin was geht
        </Typography>
      </Card>
    </>
  );
}

export default Home;
