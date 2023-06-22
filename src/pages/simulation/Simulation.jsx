import React, { Fragment, useState, useEffect } from "react";
import { create } from "xmlbuilder";
import {
  Button,
  Container,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Typography,
  TableContainer,
  TableBody,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Input,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Tooltip,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import DeliveryProgram from "./components/DeliveryProgram";
import ProductionProgram from "./components/ProductionProgram";
import Workinghours from "./components/Workhours";
import Overview from "./components/Overview";
import ProductionOrder from "./components/ProductionOrder";
import { useGlobalState } from "../../components/GlobalStateProvider";
import { InfoOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Simulation() {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [bProductionPlanned, fSetProductionPlanned] = useState(false);
  const [bForecastLoaded, fSetForecastLoaded] = useState(false);
  const { state, setState } = useGlobalState();
  const [bValid, fSetValid] = useState(true);
  const [bGlobalValid, fSetGlobalValid] = useState(true);
  const [oPlanning, fSetPlanning] = useState({});
  const [skipped, setSkipped] = React.useState(new Set());
  const aSteps = [
    t("simulation.delivery"),
    t("simulation.production"),
    t("simulation.productionOrder"),
    t("simulation.shifts"),
    t("simulation.overview"),
  ];
  const allowedKeys = [
    "ArrowLeft",
    "ArrowRight",
    "Backspace",
    "ArrowUp",
    "ArrowDown",
    "Tab",
  ];
  const fValidHandler = (bValid) => {
    fSetValid(bValid);
  };
  const fGlobalValidHandler = (bValid) => {
    fSetGlobalValid(bValid);
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/forecasts").then((oReponse) => {
      const oObj = {
        production: [
          {
            p1: 0,
            p2: 0,
            p3: 0,
          },
          {
            p1: 0,
            p2: 0,
            p3: 0,
          },
          {
            p1: 0,
            p2: 0,
            p3: 0,
          },
          {
            p1: 0,
            p2: 0,
            p3: 0,
          },
        ],
        distribution: [
          {
            p1: 0,
            p2: 0,
            p3: 0,
          },
          {
            p1: 0,
            p2: 0,
            p3: 0,
          },
          {
            p1: 0,
            p2: 0,
            p3: 0,
          },
          {
            p1: 0,
            p2: 0,
            p3: 0,
          },
        ],
        inventory: [
          { p1: 0, p2: 0, p3: 0 },
          { p1: 0, p2: 0, p3: 0 },
          { p1: 0, p2: 0, p3: 0 },
          { p1: 0, p2: 0, p3: 0 },
        ],
        direct: {
          p1: {
            quantity: 0,
            price: 0,
            penalty: 0,
          },
          p2: {
            quantity: 0,
            price: 0,
            penalty: 0,
          },
          p3: {
            quantity: 0,
            price: 0,
            penalty: 0,
          },
        },
      };
      oObj.distribution = oReponse.data.forecasts.map((oElement) => {
        return {
          p1: oElement.p1,
          p2: oElement.p2,
          p3: oElement.p3,
        };
      });
      const aInitialInventory = [];
      const oFirstPeriodInventory = {};
      oReponse.data.products.forEach((oElement) => {
        if (oElement.productId > 3) return;
        oFirstPeriodInventory[`p${oElement.productId}`] =
          oElement.stock - oObj.distribution[0][`p${oElement.productId}`];
      });
      aInitialInventory.push(oFirstPeriodInventory);

      const oSecondPeriodInventory = {};

      oSecondPeriodInventory["p1"] =
        oFirstPeriodInventory["p1"] - oObj.distribution[1]["p1"];
      oSecondPeriodInventory["p2"] =
        oFirstPeriodInventory["p2"] - oObj.distribution[1]["p2"];
      oSecondPeriodInventory["p3"] =
        oFirstPeriodInventory["p3"] - oObj.distribution[1]["p3"];

      aInitialInventory.push(oSecondPeriodInventory);

      const oThirdPeriodInventory = {};

      oThirdPeriodInventory["p1"] =
        oSecondPeriodInventory["p1"] - oObj.distribution[2]["p1"];
      oThirdPeriodInventory["p2"] =
        oSecondPeriodInventory["p2"] - oObj.distribution[2]["p2"];
      oThirdPeriodInventory["p3"] =
        oSecondPeriodInventory["p3"] - oObj.distribution[2]["p3"];

      aInitialInventory.push(oThirdPeriodInventory);

      const oFourthPeriodInventory = {};

      oFourthPeriodInventory["p1"] =
        oThirdPeriodInventory["p1"] - oObj.distribution[3]["p1"];
      oFourthPeriodInventory["p2"] =
        oThirdPeriodInventory["p2"] - oObj.distribution[3]["p2"];
      oFourthPeriodInventory["p3"] =
        oThirdPeriodInventory["p3"] - oObj.distribution[3]["p3"];

      aInitialInventory.push(oFourthPeriodInventory);

      oObj.inventory = aInitialInventory;

      fSetForecastLoaded(true);
      fSetPlanning(oObj);
    });
  }, []);
  const fSendForecastForPlanning = () => {
    const oObj = oPlanning;
    oObj.splitting = false;
    toast.info(t("toast.infoStartCalculation"));

    axios
      .post("http://localhost:8080/api/planning", oObj, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((oReponse) => {
        if (oReponse.status === 200) {
          fSetProductionPlanned(true);
          setState({
            workingtimelist: oReponse.data.workingtimelist,
            productionlist: oReponse.data.productionlist,
            orderlist: oReponse.data.orderlist,
          });
          toast.success(t("toast.successPeriodCalculation"));
        }
      });
  };
  const fDownLoadXMLFile = (sXmlString, sFileName) => {
    const blob = new Blob([sXmlString], { type: "text/xml" });
    const sUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = sUrl;
    link.download = sFileName;
    link.click();
    URL.revokeObjectURL(sUrl);
  };
  const fHandleFinish = () => {
    toast.info(t("toast.generateXML"));
    const oData = state;
    const oProduction = oPlanning;
    const oObj = {
      input: {
        qualitycontrol: {
          "@type": "no",
          "@losequantity": "0",
          "@delay": "0",
        },
        sellwish: {
          item: [],
        },
        selldirect: {
          item: [],
        },
        orderlist: {
          order: [],
        },
        productionlist: {
          production: [],
        },
        workingtimelist: {
          workingtime: [],
        },
      },
    };

    oData.orderlist.forEach((oOrder) => {
      oObj.input.orderlist.order.push({
        "@article": oOrder.article,
        "@quantity": oOrder.quantity,
        "@modus": oOrder.modus,
      });
    });

    oData.productionlist.forEach((oProduction) => {
      oObj.input.productionlist.production.push({
        "@article": oProduction.article,
        "@quantity": oProduction.quantity,
      });
    });

    oData.workingtimelist.forEach((oWorkstation) => {
      oObj.input.workingtimelist.workingtime.push({
        "@station": oWorkstation.station,
        "@shift": oWorkstation.shift,
        "@overtime": oWorkstation.overtime,
      });
    });

    Object.entries(oProduction["production"][0]).forEach((oArticle) => {
      oObj.input.sellwish.item.push({
        "@article":
          oArticle[0] === "p1" ? "1" : oArticle[0] === "p2" ? "2" : "3",
        "@quantity": oArticle[1],
      });
    });

    Object.entries(oProduction["direct"]).forEach((oArticle) => {
      oObj.input.selldirect.item.push({
        "@article":
          oArticle[0] === "p1" ? "1" : oArticle[0] === "p2" ? "2" : "3",
        "@quantity": oArticle[1].quantity,
        "@price": oArticle[1].price,
        "@penalty": oArticle[1].penalty,
      });
    });

    const xmlresult = create(oObj).end({ prettyPrint: true });

    const sFileName = "inputFile.xml";

    fDownLoadXMLFile(xmlresult, sFileName);
  };

  const fUpdateProduction = (oEvent) => {
    const sKey = oEvent.currentTarget.getAttribute("t-key");
    const aKeys = sKey.split(" ");
    const sAmount = oEvent.target.value;

    fSetPlanning((oNewPlanning) => {
      const iNewProductionValue = Number(sAmount);
      const iOldProductionValue = Number(
        oNewPlanning["production"][aKeys[0]][aKeys[1]]
      );

      oNewPlanning["production"][aKeys[0]][aKeys[1]] = Number(sAmount);
      const iValueDifference = iNewProductionValue - iOldProductionValue;

      let iNewValue;

      for (aKeys[0]; aKeys[0] < 4; aKeys[0]++) {
        iNewValue =
          oNewPlanning["inventory"][aKeys[0]][aKeys[1]] + iValueDifference;
        oNewPlanning["inventory"][aKeys[0]][aKeys[1]] = iNewValue;
      }

      return oNewPlanning;
    });
  };

  const fUpdateDistribution = (oEvent) => {
    const sKey = oEvent.currentTarget.getAttribute("t-key");
    const aKeys = sKey.split(" ");
    const sAmount = oEvent.target.value;

    fSetPlanning((oNewPlanning) => {
      const iNewProductionValue = Number(sAmount);
      const iOldProductionValue = Number(
        oNewPlanning["distribution"][aKeys[0]][aKeys[1]]
      );

      oNewPlanning["distribution"][aKeys[0]][aKeys[1]] = Number(sAmount);
      const iValueDifference = iOldProductionValue - iNewProductionValue;

      let iNewValue;

      for (aKeys[0]; aKeys[0] < 4; aKeys[0]++) {
        iNewValue =
          oNewPlanning["inventory"][aKeys[0]][aKeys[1]] + iValueDifference;
        oNewPlanning["inventory"][aKeys[0]][aKeys[1]] = iNewValue;
      }

      return oNewPlanning;
    });
  };

  const fUpdateDirectAmount = (oEvent) => {
    const sKey = oEvent.currentTarget.getAttribute("t-key");
    const sAmount = oEvent.target.value;
    const bValid = /^[0-9]*$/.test(sAmount) && sAmount.length > 0;
    fValidHandler(bValid);
    fSetPlanning((oForecast) => {
      oForecast["direct"][sKey].quantity = Number(sAmount);
      return oForecast;
    });
  };

  const fUpdateDirectPrice = (oEvent) => {
    const sKey = oEvent.currentTarget.getAttribute("t-key");
    const sAmount = oEvent.target.value;
    const bValid = /^[0-9]*$/.test(sAmount) && sAmount.length > 0;
    fValidHandler(bValid);
    fSetPlanning((oForecast) => {
      oForecast["direct"][sKey].price = Number(sAmount);
      return oForecast;
    });
  };

  const fUpdateDirectPenalty = (oEvent) => {
    const sKey = oEvent.currentTarget.getAttribute("t-key");
    const sAmount = oEvent.target.value;
    const bValid = /^[0-9]*$/.test(sAmount) && sAmount.length > 0;
    fValidHandler(bValid);
    fSetPlanning((oForecast) => {
      oForecast["direct"][sKey].penalty = Number(sAmount);
      return oForecast;
    });
  };

  const fIsStepOptional = (step) => {
    return step === aSteps.length;
  };

  const fIsStepSkipped = (step) => {
    return skipped.has(step);
  };

  const fHandleNext = () => {
    let newSkipped = skipped;
    if (fIsStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const fHandleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const fHandleSkip = () => {
    if (!fIsStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  return (
    <>
      {bForecastLoaded && (
        <>
          {!bProductionPlanned && (
            <Container maxWidth="xl">
              <Box
                sx={{ bgcolor: "rgb(250, 250, 250)", height: "900px", p: 5 }}
              >
                <Box sx={{ marginBottom: "20px" }}>
                  {/* Vetriebssplanung */}
                  <Box>
                    <Tooltip
                      title={t(
                        "simulation.tooltipInventoryOverviewEndOfPeriod"
                      )}
                    >
                      <InfoOutlined />
                    </Tooltip>
                  </Box>
                  {t("simulaiton.tooltipDistributionPlanning")}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          {oPlanning.distribution.map((oPeriod, index) => {
                            return (
                              <TableCell align="center">
                                <InputLabel>
                                  {t("simulation.distributionAmount") +
                                    " P+" +
                                    (index + 1)}
                                </InputLabel>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(oPlanning.distribution[0]).map(
                          (oProduct) => {
                            return (
                              <TableRow>
                                <TableCell align="center">
                                  {t(`fileupload.product${oProduct[0]}`)}
                                </TableCell>
                                {oPlanning.distribution.map(
                                  (oPeriod, index) => {
                                    return (
                                      <TableCell
                                        t-key={`${index} ${oProduct[0]}`}
                                        onChange={fUpdateDistribution}
                                        align="center"
                                      >
                                        <Input
                                          type="number"
                                          error={!bValid}
                                          t-key={oProduct[0]}
                                          style={{ width: "8rem" }}
                                          defaultValue={oPeriod[oProduct[0]]}
                                          inputProps={{
                                            min: 0,
                                            onKeyDown: (event) => {
                                              if (
                                                (!/^\d$/.test(event.key) &&
                                                  !allowedKeys.includes(
                                                    event.key
                                                  )) ||
                                                (event.key === "Backspace" &&
                                                  event.target.value.length ===
                                                    1)
                                              ) {
                                                event.preventDefault();
                                              }
                                            },
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  }
                                )}
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box sx={{ marginBottom: "20px" }}>
                  {/* Produktionsplanung */}
                  <Box>
                    <Tooltip title={t("simulation.tooltipProductionPlanning")}>
                      <InfoOutlined />
                    </Tooltip>
                  </Box>
                  {t("simulation.productionPlanning")}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          {oPlanning.production.map((oPeriod, index) => {
                            return (
                              <TableCell align="center">
                                <InputLabel>
                                  {t("simulation.productionPlanningAmount") +
                                    " P+" +
                                    (index + 1)}
                                </InputLabel>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(oPlanning.production[0]).map(
                          (oProduct) => {
                            return (
                              <TableRow>
                                <TableCell align="center">
                                  {t(`fileupload.product${oProduct[0]}`)}
                                </TableCell>
                                {oPlanning.production.map((oPeriod, index) => {
                                  return (
                                    <TableCell
                                      t-key={`${index} ${oProduct[0]}`}
                                      onChange={fUpdateProduction}
                                      align="center"
                                    >
                                      <Input
                                        type="number"
                                        error={!bValid}
                                        t-key={oProduct[0]}
                                        style={{ width: "8rem" }}
                                        defaultValue={oPeriod[oProduct[0]]}
                                        inputProps={{
                                          min: 0,
                                          onKeyDown: (event) => {
                                            if (
                                              (!/^\d$/.test(event.key) &&
                                                !allowedKeys.includes(
                                                  event.key
                                                )) ||
                                              (event.key === "Backspace" &&
                                                event.target.value.length === 1)
                                            ) {
                                              event.preventDefault();
                                            }
                                          },
                                        }}
                                      />
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box sx={{ marginBottom: "20px" }}>
                  {/* Inventarüberblick */}
                  <Box>
                    <Tooltip
                      title={t(
                        "simulation.tooltipInventoryOverviewEndOfPeriod"
                      )}
                    >
                      <InfoOutlined />
                    </Tooltip>
                  </Box>
                  {t("fileupload.inventoryOverview")}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          {oPlanning.inventory.map((oPeriod, index) => {
                            return (
                              <TableCell align="center">
                                <InputLabel>
                                  {t("simulation.inventoryAmount") +
                                    " P+" +
                                    (index + 1)}
                                </InputLabel>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(oPlanning.inventory[0]).map(
                          (oProduct) => {
                            return (
                              <TableRow>
                                <TableCell align="center">
                                  {t(`fileupload.product${oProduct[0]}`)}
                                </TableCell>
                                {oPlanning.inventory.map((oPeriod, index) => {
                                  return (
                                    <TableCell
                                      t-key={`${index} ${oProduct[0]}`}
                                      align="center"
                                    >
                                      <Input
                                        style={{ width: "8rem" }}
                                        value={oPeriod[oProduct[0]]}
                                        inputProps={{
                                          readOnly: true,
                                        }}
                                      />
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box sx={{ marginBottom: "20px" }}>
                  {/* Direktverkauf */}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell align="center">
                            <Box>
                              <Tooltip
                                title={t("simulation.tooltipDirectSelling")}
                              >
                                <InfoOutlined />
                              </Tooltip>
                            </Box>
                            {t("fileupload.directSelling")}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                        <TableRow>
                          {Object.entries(oPlanning.direct).map((oProduct) => {
                            return (
                              <TableCell>
                                {t(`fileupload.product${oProduct[0]}`)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {Object.entries(oPlanning.direct).map((oProduct) => {
                            return (
                              <TableCell
                                t-key={oProduct[0]}
                                onChange={fUpdateDirectAmount}
                              >
                                <InputLabel>
                                  {t("simulation.directSellingQuantity")}
                                </InputLabel>
                                <Input
                                  type="number"
                                  error={!bValid}
                                  style={{ width: "8rem" }}
                                  defaultValue={oProduct[1].quantity}
                                  inputProps={{
                                    min: 0,
                                    onKeyDown: (event) => {
                                      if (
                                        (!/^\d$/.test(event.key) &&
                                          !allowedKeys.includes(event.key)) ||
                                        (event.key === "Backspace" &&
                                          event.target.value.length === 1)
                                      ) {
                                        event.preventDefault();
                                      }
                                    },
                                  }}
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        <TableRow>
                          {Object.entries(oPlanning.direct).map((oProduct) => {
                            return (
                              <TableCell
                                t-key={oProduct[0]}
                                onChange={fUpdateDirectPrice}
                              >
                                <InputLabel>
                                  {t("simulation.directSellingPrice")}
                                </InputLabel>
                                <Input
                                  type="number"
                                  error={!bValid}
                                  style={{ width: "8rem" }}
                                  defaultValue={oProduct[1].price}
                                  inputProps={{
                                    min: 0,
                                    onKeyDown: (event) => {
                                      if (
                                        (!/^\d$/.test(event.key) &&
                                          !allowedKeys.includes(event.key)) ||
                                        (event.key === "Backspace" &&
                                          event.target.value.length === 1)
                                      ) {
                                        event.preventDefault();
                                      }
                                    },
                                  }}
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        <TableRow>
                          {Object.entries(oPlanning.direct).map((oProduct) => {
                            return (
                              <TableCell
                                t-key={oProduct[0]}
                                onChange={fUpdateDirectPenalty}
                              >
                                <InputLabel>
                                  {t("simulation.directSellingPenalty")}
                                </InputLabel>
                                <Input
                                  type="number"
                                  error={!bValid}
                                  style={{ width: "8rem" }}
                                  defaultValue={oProduct[1].penalty}
                                  inputProps={{
                                    min: 0,
                                    onKeyDown: (event) => {
                                      if (
                                        (!/^\d$/.test(event.key) &&
                                          !allowedKeys.includes(event.key)) ||
                                        (event.key === "Backspace" &&
                                          event.target.value.length === 1)
                                      ) {
                                        event.preventDefault();
                                      }
                                    },
                                  }}
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={fSendForecastForPlanning}
                disabled={!bValid}
                sx={{ mt: 70 }}
              >
                {t("simulation.planPeriod")}
              </Button>
              {!bValid && (
                <FormHelperText id="form-helper" error>
                  {t("simulation.inputInvalid")}
                </FormHelperText>
              )}
            </Container>
          )}
          {bProductionPlanned && (
            <Box sx={{ bgcolor: "rgb(250, 250, 250)", height: "900px", p: 5 }}>
              <Stepper activeStep={activeStep}>
                {aSteps.map((sStep) => {
                  return (
                    <Step>
                      <StepLabel>{sStep}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep != aSteps.length ? (
                <Fragment>
                  <Typography>{aSteps[activeStep]}</Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <div>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0 || !bGlobalValid}
                        onClick={fHandleBack}
                        sx={{ mr: 1 }}
                      >
                        {t("simulation.back")}
                      </Button>
                    </div>
                    {activeStep === 0 && (
                      <DeliveryProgram
                        data={state.orderlist}
                        validate={fGlobalValidHandler}
                      />
                    )}
                    {activeStep === 1 && (
                      <ProductionProgram
                        data={state.productionlist}
                        validate={fGlobalValidHandler}
                      />
                    )}
                    {activeStep === 2 && (
                      <ProductionOrder
                        data={state.productionlist}
                        validate={fGlobalValidHandler}
                      />
                    )}
                    {activeStep === 3 && (
                      <Workinghours
                        data={state.workingtimelist}
                        validate={fGlobalValidHandler}
                      />
                    )}

                    {activeStep === 4 && <Overview data={state} />}
                    <Box sx={{ flex: "1 1 auto" }} />
                    <div>
                      {fIsStepOptional(activeStep) && (
                        <Button
                          color="inherit"
                          onClick={fHandleSkip}
                          sx={{ mr: 1 }}
                          disabled={!bGlobalValid}
                        >
                          {t("simulation.skip")}
                        </Button>
                      )}
                    </div>
                    <div>
                      <Button
                        onClick={fHandleNext}
                        style={{
                          visibility:
                            activeStep !== aSteps.length - 1
                              ? "visible"
                              : "hidden",
                        }}
                        disabled={!bGlobalValid}
                      >
                        {t("simulation.next")}
                      </Button>
                      <Button
                        onClick={fHandleFinish}
                        style={{
                          visibility:
                            activeStep === aSteps.length - 1
                              ? "visible"
                              : "hidden",
                        }}
                        disabled={!bGlobalValid}
                      >
                        {t("simulation.finish")}
                      </Button>
                    </div>
                  </Box>
                </Fragment>
              ) : (
                <Fragment></Fragment>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default Simulation;
