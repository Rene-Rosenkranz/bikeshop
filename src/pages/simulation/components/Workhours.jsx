import { FormControl, Input, InputLabel, FormHelperText } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";

function Workinghours(props) {
  return (
    <>
      <Box>
        {props.data.map((oElement) => {
          const { t, i18n } = useTranslation();
          return (
            <FormControl>
              <InputLabel>
                {t("simulation.workstation") + " " + oElement.workplace}
              </InputLabel>
              <Input
                type="number"
                aria-describedby="form-helper"
                inputProps={{ min: 1, max: 3 }}
                defaultValue={oElement.shift}
              />
              <Input
                type="number"
                inputProps={{ min: 0, max: 241 }}
                defaultValue={oElement.overtime}
              />
              <FormHelperText id="form-helper">
                {t("simulation.workstationValues")}
              </FormHelperText>
            </FormControl>
          );
        })}
      </Box>
    </>
  );
}
export default Workinghours;
