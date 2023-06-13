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
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";
import { InfoOutlined } from "@mui/icons-material";

function Workinghours(props) {
  const fSetGlobalValid = props.validate;
  const { t, i18n } = useTranslation();
  const { state, setState } = useGlobalState();
  const [bValid, fSetValid] = useState(true);

  const fValidHandler = (bValid) => {
    fSetValid(bValid);
    fSetGlobalValid(bValid);
  };

  return (
    <Box>
      <Tooltip arrow title={t("simulation.tooltipWorkhours")}>
        <InfoOutlined />
      </Tooltip>
      {props.data.map((oElement) => {
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
                  <InputLabel>{t("simulation.shifts")}</InputLabel>
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
                      const bIsValid =
                        /^[0-9]*$/.test(oEvent.target.value) &&
                        oEvent.target.value.length > 0 &&
                        oEvent.target.valueAsNumber <= 3;
                      fValidHandler(bIsValid);
                      if (!bIsValid) return;
                      const oNewState = state;
                      const oIndex = oNewState["workingtimelist"].find(
                        (oObject) => oObject.station === oElement.station
                      );
                      const iIndex =
                        oNewState["workingtimelist"].indexOf(oIndex);
                      oNewState["workingtimelist"][iIndex].shift =
                        oEvent.target.valueAsNumber;
                      setState(oNewState);
                    }}
                  />
                </FormControl>
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
