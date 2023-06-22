import React, { useState, useEffect } from "react";
import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Tooltip,
  Select,
  MenuItem,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";
import { InfoOutlined, Label } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductionProgram(props) {
  const fSetGlobalValid = props.validate;
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const { state, setState } = useGlobalState();
  const [bValid, setValid] = useState(true);

  useEffect(() => {
    setItems(props.data);
  }, [state]);

  const fValidHandler = (bValid) => {
    setValid(bValid);
    fSetGlobalValid(bValid);
  };

  const handleSplitItem = (oElement) => {
    const newState = state;
    const iIndex = newState["productionlist"].indexOf(oElement);
    const iNewQuantity =
      oElement.quantity % 2 === 0
        ? oElement.quantity / 2
        : Math.trunc(oElement.quantity / 2);
    const oNewItem = {
      ...oElement,
      quantity: iNewQuantity,
      sequenceNumer: newState["productionlist"].length + 1,
      id: state["productionlist"].length,
    };
    newState["productionlist"][iIndex].quantity = iNewQuantity;
    newState["productionlist"].push(oNewItem);
    setState(newState);
    setItems(newState["productionlist"]);
    toast.info(t("toast.infoSplitItem"));
  };

  return (
    <>
      <Box alignContent="center">
        <Tooltip arrow title={t("simulation.tooltipProductionProgram")}>
          <InfoOutlined />
        </Tooltip>
        {items.length > 0 ? (
          items.map((oElement) => (
            <Paper
              key={oElement.id}
              elevation={3}
              sx={{
                margin: "1rem",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InputLabel>{t("simulation.part")}</InputLabel>
                  <Box sx={{ marginLeft: "0.5rem" }}>{oElement.article}</Box>
                </Box>
                <FormControl
                  required={true}
                  size="small"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Input
                    type="number"
                    error={!bValid}
                    inputProps={{
                      min: 0,
                      onKeyDown: (event) => {
                        event.preventDefault();
                      },
                    }}
                    aria-describedby="form-helper"
                    value={oElement.quantity}
                    sx={{ width: "6rem", textAlign: "center" }}
                    onChange={(oEvent) => {
                      const bIsEmpty = !(
                        /^[0-9]*$/.test(oEvent.target.value) &&
                        oEvent.target.value.length > 0
                      );
                      fValidHandler(!bIsEmpty);
                      if (bIsEmpty) return;
                      const oNewState = state;
                      const oIndex = oNewState["productionlist"].find(
                        (oObject) => oObject.article === oElement.article
                      );
                      const iIndex =
                        oNewState["productionlist"].indexOf(oIndex);
                      oNewState["productionlist"][iIndex].quantity =
                        oEvent.target.valueAsNumber;
                      setState(oNewState);
                    }}
                  />
                  {bValid && (
                    <FormHelperText id="form-helper">
                      {t("simulation.productionAmount")}
                    </FormHelperText>
                  )}
                  {!bValid && (
                    <FormHelperText id="form-helper" error>
                      {t("simulation.errorMissingInput")}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button
                variant="outlined"
                sx={{ marginLeft: "1rem" }}
                onClick={() => handleSplitItem(oElement)}
              >
                {t("simulation.splitItem")}
              </Button>
            </Paper>
          ))
        ) : (
          <Typography>{t("simulation.noItems")}</Typography>
        )}
      </Box>
    </>
  );
}

export default ProductionProgram;
