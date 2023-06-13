import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";
import { InfoOutlined } from "@mui/icons-material";

function Workinghours(props) {
  const fSetGlobalValid = props.validate;
  const { t, i18n } = useTranslation();
  return (
    <>
      <Box alignContent="center">
        <Tooltip arrow title={t("simulation.tooltipWorkhours")}>
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
            <Box alignContent="center" margin="2rem">
              <FormControl>
                <InputLabel>
                  {t("simulation.workstation") + " " + oElement.station}
                </InputLabel>
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
                    const iIndex = oNewState["workingtimelist"].indexOf(oIndex);
                    oNewState["workingtimelist"][iIndex].shift =
                      oEvent.target.valueAsNumber;
                    setState(oNewState);
                  }}
                />
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
                    if (oIndex.shift === 3 && oEvent.target.valueAsNumber > 0) {
                      bIsValid = false;
                    }
                    fValidHandler(bIsValid);
                    const iIndex = oNewState["workingtimelist"].indexOf(oIndex);
                    oNewState["workingtimelist"][iIndex].overtime =
                      oEvent.target.valueAsNumber;
                    setState(oNewState);
                  }}
                />
                {bValid && (
                  <FormHelperText id="form-helper">
                    {t("simulation.workstationValues")}
                  </FormHelperText>
                )}
                {!bValid && (
                  <FormHelperText id="form-helper" error>
                    {t("simulation.errorMissingInput")}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
export default Workinghours;
