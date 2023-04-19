import { FormControl, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";

function ModeMenu(data) {
  const { t, i18n } = useTranslation();
  const { oState, fSetState } = useGlobalState();

  const oShippingMethods = [
    { value: 5, text: t("simulation.shippingMethods.normal") },
    { value: 4, text: t("simulation.shippingMethods.fast") },
    { value: 3, text: t("simulation.shippingMethods.JIT") },
    { value: 2, text: t("simulation.shippingMethods.cheapVendor") },
    { value: 1, text: t("simulation.shippingMethods.specialDelivery") },
  ];

  const [iMode, fSetMode] = useState(data.value);
  const fHandleChange = (oEvent) => {
    const iMode = oEvent.target.value;
    fSetMode(iMode);
    const oNewState = oState;
    const iIndex = oNewState["orders"].find(
      (oObject) => oObject.part === oElement.part
    );
    oNewState["orders"][iIndex].mode = oEvent.target.valueAsNumber;
    fSetState(oNewState);
  };
  return (
    <FormControl>
      <Select value={iMode} label="Versandart" onChange={fHandleChange}>
        {oShippingMethods.map((oMenuItem) => {
          return <MenuItem value={oMenuItem.value}>{oMenuItem.text}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}
export default ModeMenu;
