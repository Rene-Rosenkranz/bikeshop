import React, { useState } from "react";
import { Input, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";

function ProductionProgram(props) {
  return (
    <>
      <Box>
        {props.data.map((oElement) => {
          const { t, i18n } = useTranslation();
          let [bValid, fSetValid] = useState(true);

          const fValidHandler = (bValid) => {
            fSetValid(bValid);
          };
          return (
            <FormControl
              required={true}
              size="small"
              sx={{ display: "inline-flex" }}
            >
              <InputLabel>
                {t("simulation.component") + " " + oElement.part}
              </InputLabel>
              <Input
                type="number"
                error={!bValid}
                inputProps={{ min: 0 }}
                aria-describedby="form-helper"
                defaultValue={oElement.amount}
                onChange={(oInput) => {
                  const bIsEmpty = !!oInput.target.value;
                  fValidHandler(bIsEmpty);
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
          );
        })}
      </Box>
    </>
  );
}

export default ProductionProgram;
