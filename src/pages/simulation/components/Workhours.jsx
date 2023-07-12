import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Tooltip,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";
import { InfoOutlined } from "@mui/icons-material";

function Workinghours({ data, calculations, validate }) {
  const [items, setItems] = useState([]);
  const fSetGlobalValid = validate;
  const { t, i18n } = useTranslation();
  const { state, setState } = useGlobalState();
  const [bValid, fSetValid] = useState(true);

  const fValidHandler = (bValid) => {
    fSetValid(bValid);
    fSetGlobalValid(bValid);
  };

  useEffect(() => {
    setItems(data);
  }, [state]);

  const getCalculationExplanation = (element) => {
    if (calculations) {
      const calculation = calculations.find((calc) => calc.element === element);
      if (calculation) {
        return calculation.explanation;
      }
    }
    return "Das wurde so berechnet";
  };

  return (
    <Box>
      <Tooltip arrow title={t("simulation.tooltipWorkhours")}>
        <InfoOutlined />
      </Tooltip>
      {items &&
        items.map((oElement) => {
          return (
            <Box
              key={oElement.station}
              sx={{
                margin: "2rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                width: "500px",
              }}
            >
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" marginBottom="0.5rem">
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginLeft: "1rem" }}
                    >
                      {t("simulation.workstation")} {oElement.station}:
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t("simulation.shift")}</InputLabel>
                    <Input
                      type="number"
                      aria-describedby="form-helper"
                      inputProps={{
                        min: 1,
                        max: 3,
                        onKeyDown: (event) => {
                          event.preventDefault();
                        },
                      }}
                      defaultValue={oElement.shift}
                      onChange={(oEvent) => {
                        let bIsValid =
                          /^[0-9]*$/.test(oEvent.target.value) &&
                          oEvent.target.value.length > 0 &&
                          oEvent.target.valueAsNumber <= 3;

                        const oNewState = state;
                        const oIndex = oNewState["workingtimelist"].find(
                          (oObject) => oObject.station === oElement.station
                        );
                        if (
                          oEvent.target.valueAsNumber === 3 &&
                          oIndex.overtime > 0
                        ) {
                          bIsValid = false;
                        }
                        fValidHandler(bIsValid);
                        if (!bIsValid) return;

                        const iIndex =
                          oNewState["workingtimelist"].indexOf(oIndex);
                        oNewState["workingtimelist"][iIndex].shift =
                          oEvent.target.valueAsNumber;
                        if (oEvent.target.valueAsNumber === 3) {
                          oNewState["workingtimelist"][iIndex].overtime = 0;
                        }
                        setItems(oNewState["workingtimelist"]);
                        setState(oNewState);
                      }}
                    />
                  </FormControl>
                  {calculations && (
                      <Typography variant="body2">
                        Produktions- und Rüstzeiten:{getCalculationExplanation(oElement.station)}
                      </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t("simulation.overtime")}</InputLabel>
                    <Input
                      type="number"
                      inputProps={{
                        min: 0,
                        max: 241,
                        onKeyDown: (event) => {
                          event.preventDefault();
                        },
                      }}
                      defaultValue={oElement.overtime}
                      onChange={(oEvent) => {
                        const oNewState = state;
                        const oIndex = oNewState["workingtimelist"].find(
                          (oObject) => oObject.station === oElement.station
                        );
                        let bIsValid = !!oEvent.target.value;
                        if (
                          oIndex.shift === 3 &&
                          oEvent.target.valueAsNumber > 0
                        ) {
                          bIsValid = false;
                        }
                        fValidHandler(bIsValid);
                        const iIndex =
                          oNewState["workingtimelist"].indexOf(oIndex);
                        oNewState["workingtimelist"][iIndex].overtime =
                          oEvent.target.valueAsNumber;
                        setItems(oNewState["workingtimelist"]);
                        setState(oNewState);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      {!bValid && (
        <FormHelperText sx={{ fontSize: "1.2rem" }} id="form-helper" error>
          {t("simulation.errorMissingInput")}
        </FormHelperText>
      )}
    </Box>
  );
}

export default Workinghours;
