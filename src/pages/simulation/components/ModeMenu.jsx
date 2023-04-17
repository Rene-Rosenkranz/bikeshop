import { FormControl, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function ModeMenu(data) {
  const { t, i18n } = useTranslation();
  const oShippingMethods = [
    { value: 5, text: t("simulation.shippingMethods.normal") },
    { value: 4, text: t("simulation.shippingMethods.fast") },
    { value: 3, text: t("simulation.shippingMethods.JIT") },
    { value: 2, text: t("simulation.shippingMethods.cheapVendor") },
    { value: 1, text: t("simulation.shippingMethods.specialDelivery") },
  ];

  const [iMode, fSetMode] = useState(data.value);
  const fHandleChange = (oSelect) => {
    fSetMode(oSelect.target.value);
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
