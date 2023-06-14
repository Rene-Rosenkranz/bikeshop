import React, { useState } from "react";
import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import ModeMenu from "./ModeMenu";
import { useGlobalState } from "../../../components/GlobalStateProvider";

import { InfoOutlined } from "@mui/icons-material";

function DeliveryProgram(props) {
  const fSetGlobalValid = props.validate;
  const { t, i18n } = useTranslation();
  return (
    <Box>
      <Tooltip arrow title={t("simulation.tooltipDeliveryProgram")}>
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
          <Box
            key={oElement.article} // Added key prop for optimization
            marginBottom="2rem"
            border={1}
            borderRadius="5px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="1rem"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
            bgcolor="white"
          >
            <Box>
              <Box display="flex" alignItems="center">
                <strong>{t("simulation.component")}:</strong>
                <Box marginLeft="0.5rem">{oElement.article}</Box>
              </Box>
              <Box display="flex" alignItems="center">
                <strong>{t("simulation.orderAmount")}:</strong>
                <FormControl
                  required={true}
                  size="small"
                  sx={{ display: "inline-flex", marginLeft: "0.5rem" }}
                >
                  <Input
                    type="number"
                    error={!bValid}
                    inputProps={{
                      min: 0,
                      onKeyDown: (event) => {
                        event.preventDefault();
                      },
                    }}
                    aria-describedby="form-helper"
                    defaultValue={oElement.quantity}
                    onChange={(oEvent) => {
                      const bIsValid =
                        /^[0-9]*$/.test(oEvent.target.value) &&
                        oEvent.target.value.length > 0;
                      fValidHandler(bIsValid);
                      if (!bIsValid) return;
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
                  {!bValid && (
                    <FormHelperText id="form-helper" error>
                      {t("simulation.errorMissingInput")}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Box>
            <ModeMenu value={oElement.modus} element={oElement} />
          </Box>
        );
      })}
    </Box>
  );
}

export default DeliveryProgram;
