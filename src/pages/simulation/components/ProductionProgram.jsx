import React, { useState } from "react";
import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Tooltip,
  Select,
  MenuItem,
  Paper, // Import Paper component from MUI
} from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";
import { InfoOutlined, Label } from "@mui/icons-material";
import SequenceNumberMenu from "./SequenceNumberMenu";

function ProductionProgram(props) {
  const fSetGlobalValid = props.validate;
  const { t, i18n } = useTranslation();
  const [oSequences, fSetSequence] = useState();
  return (
    <>
      <Box alignContent="center">
        <Tooltip arrow title={t("simulation.tooltipProductionProgram")}>
          <InfoOutlined />
        </Tooltip>
        {props.data.map((oElement) => {
          let [bValid, fSetValid] = useState(true);
          const { state, setState } = useGlobalState();

          const fValidHandler = (bValid) => {
            fSetValid(bValid);
            fSetGlobalValid(bValid);
          };
          return (
            <Paper // Add Paper component around each item
              key={oElement.article}
              elevation={3} // Add elevation for a nice shadow effect
              sx={{
                margin: "1rem",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
              }} // Add display and alignment
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // Add justify-content: space-between to align items and value
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InputLabel>{t("simulation.part")}</InputLabel>
                  <Box sx={{ marginLeft: "0.5rem" }}>{oElement.article}</Box>
                </Box>
                <FormControl
                  required={true}
                  size="small"
                  sx={{ display: "flex", alignItems: "center" }} // Adjust display and alignment
                >
                  <Input
                    type="number"
                    error={!bValid}
                    inputProps={{ min: 0 }}
                    aria-describedby="form-helper"
                    defaultValue={oElement.quantity}
                    sx={{ width: "6rem", textAlign: "center" }} // Adjust width and center align the value
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
            </Paper>
          );
        })}
      </Box>
    </>
  );
}

export default ProductionProgram;
