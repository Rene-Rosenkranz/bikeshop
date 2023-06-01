import React, { useState } from "react";
import { Input, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";

function ProductionProgram(props) {
  const fSetGlobalValid = props.validate;
  return (
    <>
      <Box alignContent="center">
        {props.data.map((oElement) => {
          const { t, i18n } = useTranslation();
          let [bValid, fSetValid] = useState(true);
          const { state, setState } = useGlobalState();

          const fValidHandler = (bValid) => {
            fSetValid(bValid);
            fSetGlobalValid(bValid);
          };
          return (
            <Box margin="2rem">
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
                    const iIndex = oNewState["productionlist"].indexOf(oIndex);
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
          );
        })}
      </Box>
    </>
  );
}

export default ProductionProgram;
