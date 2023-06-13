import React, { useEffect, useState } from "react";
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
  Tooltip,
} from "@mui/material";
import { useGlobalState } from "../../../components/GlobalStateProvider";
import { InfoOutlined } from "@mui/icons-material";

function ProductionOrder(props) {
  const [items, setItems] = useState([]);
  const { state, setState } = useGlobalState();
  const { t, i18n } = useTranslation();
  const handleSequenceNumberChange = (itemId, newSequenceNumber) => {
    const newState = state;
    const otherObject = state["productionlist"].find(
      (oObject) => oObject.sequenceNumer === newSequenceNumber
    );
    const currentObject = state["productionlist"].find(
      (oObject) => oObject.id === itemId
    );
    const iOldSequenceNumber = currentObject.sequenceNumer;
    const iCurrentIndex = state["productionlist"].indexOf(currentObject);
    const iOtherIndex = state["productionlist"].indexOf(otherObject);

    newState["productionlist"][iCurrentIndex].sequenceNumer = newSequenceNumber;
    newState["productionlist"][iOtherIndex].sequenceNumer = iOldSequenceNumber;
    newState["productionlist"].sort(
      (a, b) => a.sequenceNumer - b.sequenceNumer
    );
    setItems(newState["productionlist"]);
    setState(newState);
  };
  useEffect(() => {
    setItems(props.data);
  }, [state]);
  return (
    <Box alignContent="center">
      <Tooltip arrow title={t("simulation.tooltipProductionProgram")}>
        <InfoOutlined />
      </Tooltip>

      <List>
        {items &&
          items.map((oItem) => {
            return (
              <ListItem key={oItem.id}>
                <ListItemText
                  primary={oItem.article}
                  secondary={t("simulation.part")}
                />
                <TextField
                  label={t("simulation.sequenceNumber")}
                  variant="outlined"
                  value={oItem.sequenceNumer}
                  onChange={(e) =>
                    handleSequenceNumberChange(
                      oItem.id,
                      parseInt(e.target.value)
                    )
                  }
                  type="number"
                  inputProps={{
                    min: 1,
                    max: state["productionlist"].length,
                    onKeyDown: (event) => {
                      event.preventDefault();
                    },
                  }}
                  sx={{ marginLeft: "10px" }}
                />
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
}

export default ProductionOrder;
