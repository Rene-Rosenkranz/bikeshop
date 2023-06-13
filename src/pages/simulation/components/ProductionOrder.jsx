import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import {
  Grid,
  List,
  MenuItem,
  Typography,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useGlobalState } from "../../../components/GlobalStateProvider";

function ProductionOrder(props) {
  const { state, setState } = useGlobalState();
  const handleSequenceNumberChange = (itemId, newSequenceNumber) => {};
  return (
    <>
      <Grid alignContent="center">
        <List>
          {props.data.map((oItem) => {
            return (
              <ListItem key={oItem.id}>
                <ListItemText primary={oItem.article} secondary="Stelle" />
                <TextField
                  label="Sequence Number"
                  variant="outlined"
                  value={oItem.sequenceNumer}
                  onChange={(e) =>
                    handleSequenceNumberChange(
                      oItem.id,
                      parseInt(e.target.value)
                    )
                  }
                  type="number"
                  inputProps={{ min: 1, max: state["productionlist"].length }}
                />
              </ListItem>
            );
          })}
        </List>
      </Grid>
    </>
  );
}

export default ProductionOrder;
