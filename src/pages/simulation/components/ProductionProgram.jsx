import React, { useState, useEffect } from "react";
import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Tooltip,
  Select,
  MenuItem,
  Paper,
  Button,
  Typography,
  Popover,
} from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../components/GlobalStateProvider";
import { InfoOutlined, Label } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductionProgram(props) {
  const fSetGlobalValid = props.validate;
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  const { state, setState } = useGlobalState();
  const [bValid, setValid] = useState(true);
  const [iMaxValue, setMaxValue] = useState(0);
  const [iInputValue, setInputValue] = useState(0);
  const [oCurrentElement, setCurrentElement] = useState({});
  const [expandedItemIndex, setExpandedItemIndex] = useState(null);
  const allowedKeys = [
    "ArrowLeft",
    "ArrowRight",
    "Backspace",
    "ArrowUp",
    "ArrowDown",
    "Tab",
  ];

  useEffect(() => {
    setItems(props.data);
  }, [state]);

  const fValidHandler = (bValid) => {
    setValid(bValid);
    fSetGlobalValid(bValid);
  };

  const bOpen = Boolean(anchorEl);
  const id = bOpen ? "splitting-popup" : undefined;

  const handleClick = (oEvent, oElement) => {
    setAnchorEl(oEvent.currentTarget);
    setMaxValue(oElement.quantity - 1);
    setInputValue(Math.trunc(oElement.quantity / 2));
    setCurrentElement(oElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSplitItem = (oElement, oEvent) => {
    const newState = state;
    const iIndex = newState["productionlist"].indexOf(oCurrentElement);
    const iNewQuantity = iInputValue;
    const iOldQuantity = newState["productionlist"][iIndex].quantity;
    const oNewItem = {
      ...oCurrentElement,
      quantity: iNewQuantity,
      sequenceNumer: newState["productionlist"].length + 1,
      id: state["productionlist"].length,
    };
    newState["productionlist"][iIndex].quantity = iOldQuantity - iNewQuantity;
    newState["productionlist"].push(oNewItem);
    setState(newState);
    setItems(newState["productionlist"]);
    toast.info(t("toast.infoSplitItem"));
    setAnchorEl(null);
  };

  const handleSequenceNumberChange = (itemId, newSequenceNumber) => {
    const newState = state;
    const otherObject = state["productionlist"].find(
        (oObject) => oObject.sequenceNumer === newSequenceNumber
    );
    const currentObject = state["productionlist"].find(
        (oObject) => oObject.id === itemId
    );
    const iOldSequenceNumber = currentObject.sequenceNumer;
    const iCurrentIndex = state["productionlist"].indexOf(currentObject);
    const iOtherIndex = state["productionlist"].indexOf(otherObject);

    newState["productionlist"][iCurrentIndex].sequenceNumer = newSequenceNumber;
    newState["productionlist"][iOtherIndex].sequenceNumer = iOldSequenceNumber;
    newState["productionlist"].sort(
        (a, b) => a.sequenceNumer - b.sequenceNumer
    );
    setItems(newState["productionlist"]);
    setState(newState);
  };

  const handleToggleOrderInfos = (index) => {
    if (expandedItemIndex === index) {
      setExpandedItemIndex(null);
    } else {
      setExpandedItemIndex(index);
    }
  };

  return (
      <>
        <Box alignContent="center">
          <Tooltip arrow title={t("simulation.tooltipProductionProgram")}>
            <InfoOutlined />
          </Tooltip>
          {items.length > 0 ? (
              items.map((oElement, index) => (
                  <Paper
                      key={oElement.sequenceNumer}
                      elevation={3}
                      sx={{
                        margin: "1rem",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                      }}
                  >
                    <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "1rem",
                        }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <InputLabel>{t("simulation.part")}</InputLabel>
                        <Box sx={{ marginLeft: "0.5rem" }}>{oElement.article}</Box>
                      </Box>
                      <FormControl
                          required={true}
                          size="small"
                          sx={{ display: "flex", alignItems: "center" }}
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
                            value={oElement.quantity}
                            sx={{ width: "6rem", textAlign: "center" }}
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
                              const iIndex =
                                  oNewState["productionlist"].indexOf(oIndex);
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
                      <Box sx={{ marginLeft: "1rem" }}>
                        <Button
                            variant="outlined"
                            onClick={(oEvent) => handleClick(oEvent, oElement)}
                        >
                          {t("simulation.splitItem")}
                        </Button>
                      </Box>
                    </Box>
                    {expandedItemIndex === index && (
                        <Box marginTop="1rem">
                          <p>Bauteil: {oElement.name}</p>
                          {oElement.informations.map((info, infoIndex) => (
                              <p key={infoIndex}>{info}</p>
                          ))}
                        </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box sx={{ marginTop: "1rem", marginLeft: "1rem" }}>
                        <Button
                            variant="contained"
                            onClick={() => handleToggleOrderInfos(index)}
                            sx={{
                              backgroundColor: "white",
                              color: "black",
                              "&:hover": {
                                backgroundColor: "crimsonblue",
                              },
                            }}
                        >
                          {expandedItemIndex === index
                              ? "Informationen ausblenden"
                              : "Informationen anzeigen"}
                        </Button>
                      </Box>
                    </Box>
                    <Popover
                        id={id}
                        open={bOpen}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                    >
                      <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "1rem",
                          }}
                      >
                        <Typography>{t("simulation.splitItem")}</Typography>
                        <Input
                            id="input"
                            type="number"
                            onFocus={() => {
                              const inputElement = document.getElementById("input");
                              const hiddenInputElement =
                                  document.getElementById("hiddenInput");
                              hiddenInputElement.value = inputElement.value;
                            }}
                            onChange={(oEvent) => {
                              setInputValue(Number(oEvent.target.value));
                              const inputElement = document.getElementById("input");
                              const hiddenInputElement =
                                  document.getElementById("hiddenInput");
                              hiddenInputElement.value = inputElement.value;
                            }}
                            inputProps={{
                              min: 1,
                              max: iMaxValue,
                              defaultValue: iInputValue,
                              onKeyDown: (event) => {
                                const inputElement = event.target;
                                const hiddenInputElement =
                                    document.getElementById("hiddenInput");
                                const cursorPosition =
                                    hiddenInputElement.selectionStart;
                                const newInput = Number(
                                    inputElement.value.slice(0, cursorPosition) +
                                    event.key +
                                    inputElement.value.slice(cursorPosition)
                                );
                                if (
                                    (!/^\d$/.test(event.key) &&
                                        !allowedKeys.includes(event.key)) ||
                                    (event.key === "Backspace" &&
                                        event.target.value.length === 1) ||
                                    (!!newInput && (newInput > iMaxValue || newInput < 1))
                                ) {
                                  event.preventDefault();
                                }
                              },
                            }}
                        />
                        <input
                            type="text"
                            id="hiddenInput"
                            style={{ display: "none" }}
                        />
                        <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              marginTop: "1rem",
                            }}
                        >
                          <Button
                              variant="contained"
                              onClick={(oEvent) => handleSplitItem(oElement, oEvent)}
                              sx={{
                                margin: "0.5rem",
                              }}
                          >
                            {t("simulation.confirm")}
                          </Button>
                          <Button
                              variant="contained"
                              onClick={handleClose}
                              sx={{
                                margin: "0.5rem",
                              }}
                          >
                            {t("simulation.cancel")}
                          </Button>
                        </Box>
                      </Box>
                    </Popover>
                  </Paper>
              ))
          ) : (
              <Typography>{t("simulation.noItems")}</Typography>
          )}
        </Box>
      </>
  );
}

export default ProductionProgram;
