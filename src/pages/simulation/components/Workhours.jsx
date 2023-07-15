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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Workinghours({ data, calculations, validate }) {
  const [items, setItems] = useState([]);
  const fSetGlobalValid = validate;
  const { t, i18n } = useTranslation();
  const { state, setState } = useGlobalState();
  const [iMaxNumber, setMaxNumber] = useState(241);

  const allowedKeys = [
    "ArrowLeft",
    "ArrowRight",
    "Backspace",
    "ArrowUp",
    "ArrowDown",
    "Tab",
  ];

  useEffect(() => {
    setItems(state["workingtimelist"]);
  }, [items]);

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
        items.length > 0 &&
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
                width: "650px",
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
                      id={"inputshift" + oElement.station}
                      aria-describedby="form-helper"
                      inputProps={{
                        min: 1,
                        max: 3,
                        onKeyDown: (event) => {
                          const inputElement = event.target;
                          const hiddenInputElement =
                            document.getElementById("hiddenInput");
                          const cursorPosition =
                            hiddenInputElement.selectionStart;
                          const newInput = Number(
                            inputElement.value.slice(0, cursorPosition) +
                              event.key +
                              inputElement.value.slice(cursorPosition)
                          );
                          if (
                            (!/^\d$/.test(event.key) &&
                              !allowedKeys.includes(event.key)) ||
                            (event.key === "Backspace" &&
                              event.target.value.length === 1) ||
                            Number(event.key) > 3 ||
                            Number(event.key) < 1
                          ) {
                            event.preventDefault();
                          }
                        },
                      }}
                      value={oElement.shift}
                      onChange={(oEvent) => {
                        const oNewState = state;
                        const oIndex = oNewState["workingtimelist"].find(
                          (oObject) => oObject.station === oElement.station
                        );

                        const iIndex =
                          oNewState["workingtimelist"].indexOf(oIndex);
                        oNewState["workingtimelist"][iIndex].shift =
                          oEvent.target.valueAsNumber;
                        if (oEvent.target.valueAsNumber === 3) {
                          oNewState["workingtimelist"][iIndex].overtime = 0;
                          document.getElementById(
                            `inputovertime${oElement.station}`
                          ).value = 0;
                        }
                        /* setItems(...oNewState["workingtimelist"]); */
                        setState(oNewState);
                      }}
                    />
                  </FormControl>
                  {calculations && (
                    <Typography variant="body2" alignContent="start">
                      Produktions- und Rüstzeiten:
                      {getCalculationExplanation(oElement.station)}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t("simulation.overtime")}</InputLabel>
                    <Input
                      id={"inputovertime" + oElement.station}
                      type="number"
                      inputProps={{
                        min: 0,
                        max: iMaxNumber,
                        onKeyDown: (event) => {
                          const inputElement = event.target;
                          const hiddenInputElement =
                            document.getElementById("hiddenInput");
                          const cursorPosition =
                            hiddenInputElement.selectionStart;
                          const newInput = Number(
                            inputElement.value.slice(0, cursorPosition) +
                              event.key +
                              inputElement.value.slice(cursorPosition)
                          );
                          const bWrongKey =
                            (!/^\d$/.test(event.key) &&
                              !allowedKeys.includes(event.key)) ||
                            (event.key === "Backspace" &&
                              event.target.value.length === 1);

                          const bShiftMax = oElement.shift === 3;
                          const bInputValueWrong =
                            !!newInput &&
                            (newInput > iMaxNumber || newInput < 1);
                          const bKeyIsNotNumber = !!Number(event.key);
                          if (bWrongKey) {
                            event.preventDefault();
                            return;
                          }

                          if (!bWrongKey && bInputValueWrong) {
                            toast.error(
                              t("toast.errorInvalidInputOvertimeExceed")
                            );
                            event.preventDefault();
                            return;
                          }
                          if (
                            !bWrongKey &&
                            !bInputValueWrong &&
                            bShiftMax &&
                            bKeyIsNotNumber
                          ) {
                            toast.error(
                              t("toast.errorInvalidInputShiftOvertime")
                            );
                            event.preventDefault();
                            return;
                          }
                        },
                      }}
                      defaultValue={oElement.overtime}
                      onChange={(oEvent) => {
                        const inputElement = document.getElementById(
                          `inputovertime${oElement.station}`
                        );
                        const hiddenInputElement =
                          document.getElementById("hiddenInput");
                        hiddenInputElement.value = inputElement.value;
                        const oNewState = state;
                        if (oElement.shift === 3) {
                          oEvent.preventDefault();
                          return;
                        }
                        const oIndex = oNewState["workingtimelist"].find(
                          (oObject) => oObject.station === oElement.station
                        );
                        const iIndex =
                          oNewState["workingtimelist"].indexOf(oIndex);
                        oNewState["workingtimelist"][iIndex].overtime =
                          oEvent.target.valueAsNumber;
                        setItems(oNewState["workingtimelist"]);
                        setState(oNewState);
                      }}
                    />
                    <input
                      type="text"
                      id="hiddenInput"
                      style={{ display: "none" }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          );
        })}
    </Box>
  );
}

export default Workinghours;
