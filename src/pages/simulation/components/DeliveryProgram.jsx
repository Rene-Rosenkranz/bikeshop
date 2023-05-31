import React, { useState } from "react";
import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Menu,
} from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import ModeMenu from "./ModeMenu";
import { useGlobalState } from "../../../components/GlobalStateProvider";

function DeliveryProgram(props) {
  return (
    <>
      <Box alignContent="center" alignItems="center">
        {props.data.map((oElement) => {
          const { t, i18n } = useTranslation();
          let [bValid, fSetValid] = useState(true);
          const { state, setState } = useGlobalState();

          const fValidHandler = (bValid) => {
            fSetValid(bValid);
          };

          return (
            <>
              <Box marginBottom="2rem">
                <FormControl
                  required={true}
                  size="small"
                  sx={{ display: "inline-flex" }}
                >
                  <InputLabel>
                    {t("simulation.component") + " " + oElement.article}
                  </InputLabel>
                  <Input
                    type="number"
                    error={!bValid}
                    inputProps={{ min: 0 }}
                    aria-describedby="form-helper"
                    defaultValue={oElement.quantity}
                    onChange={(oEvent) => {
                      const bIsEmpty = !oEvent.target.value;
                      fValidHandler(!bIsEmpty);
                      if (bIsEmpty) return;
                      const oNewState = state;
                      const oIndex = oNewState["orderlist"].find(
                        (oObject) => oObject.article === oElement.article
                      );
                      const iIndex = oNewState["orderlist"].indexOf(oIndex);
                      oNewState["orderlist"][iIndex].quantity =
                        oEvent.target.valueAsNumber;
                      setState(oNewState);
                    }}
                  />
                  {bValid && (
                    <FormHelperText id="form-helper">
                      {t("simulation.orderAmount")}
                    </FormHelperText>
                  )}
                  {!bValid && (
                    <FormHelperText id="form-helper" error>
                      {t("simulation.errorMissingInput")}
                    </FormHelperText>
                  )}
                </FormControl>
                <ModeMenu value={oElement.modus} element={oElement} />
              </Box>
            </>
          );
        })}
      </Box>
    </>
  );
}

export default DeliveryProgram;
