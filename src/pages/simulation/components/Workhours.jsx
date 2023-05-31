import { FormControl, Input, InputLabel, FormHelperText } from "@mui/material";
import React, { useState } from "react";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";

function Workinghours(props) {
  return (
    <>
      <Box alignContent="center">
        {props.data.map((oElement) => {
          const { t, i18n } = useTranslation();
          let [bValid, fSetValid] = useState(true);
          const { state, setState } = useGlobalState();

          const fValidHandler = (bValid) => {
            fSetValid(bValid);
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
                  inputProps={{ min: 1, max: 3 }}
                  defaultValue={oElement.shift}
                  onChange={(oEvent) => {
                    const bIsEmpty = !oEvent.target.value;
                    fValidHandler(!bIsEmpty);
                    if (bIsEmpty) return;
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
                  inputProps={{ min: 0, max: 241 }}
                  defaultValue={oElement.overtime}
                  onChange={(oEvent) => {
                    const bIsEmpty = !oEvent.target.value;
                    fValidHandler(!bIsEmpty);
                    if (bIsEmpty) return;
                    const oNewState = state;
                    const oIndex = oNewState["workingtimelist"].find(
                      (oObject) => oObject.station === oElement.station
                    );
                    const iIndex = oNewState["workingtimelist"].indexOf(oIndex);
                    oNewState["workingtimelist"][iIndex].overtime =
                      oEvent.target.valueAsNumber;
                    setState(oNewState);
                  }}
                />
                <FormHelperText id="form-helper">
                  {t("simulation.workstationValues")}
                </FormHelperText>
              </FormControl>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
export default Workinghours;
