import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Container,
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
} from "@mui/material";
import axios from "axios";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import DeliveryProgram from "./components/DeliveryProgram";
import ProductionProgram from "./components/ProductionProgram";
import Workinghours from "./components/Workhours";
import Overview from "./components/Overview";
import { useGlobalState } from "../../components/GlobalStateProvider";

function Simulation() {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [bProductionPlanned, fSetProductionPlanned] = useState(false);
  const { state, setState } = useGlobalState();
  const [bValid, fSetValid] = useState(true);
  const [bGlobalValid, fSetGlobalValid] = useState(true);
  const [oForecast, fSetForecast] = useState({
    p1: 150,
    p2: 200,
    p3: 250,
  });
  const [skipped, setSkipped] = React.useState(new Set());
  const aSteps = [
    t("simulation.delivery"),
    t("simulation.production"),
    t("simulation.shifts"),
    t("simulation.overview"),
  ];
  const fValidHandler = (bValid) => {
    fSetValid(bValid);
  };
  const fGlobalValidHandler = (bValid) => {
    fSetGlobalValid(bValid);
  };
  /* useEffect(() => {
    axios
      .get("http://localhost:8080/api/getForecast")
      .then((oReponse) => fSetForecast(oReponse.data));
  }); */
  const fSendForecastForPlanning = () => {
    let aProduction = [];
    for (let index = 0; index < 4; index++) {
      aProduction.push({
        periode: index + 1,
        product1Consumption: oForecast["p1"],
        product2Consumption: oForecast["p2"],
        product3Consumption: oForecast["p3"],
      });
    }
    axios
      .post("http://localhost:8080/api/planning", aProduction, {
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
        }
      });
  };

  const fUpdateForecast = (oEvent) => {
    const sKey = oEvent.currentTarget.getAttribute("t-key");
    const sAmount = oEvent.target.value;
    const bValid = /^[0-9]*$/.test(sAmount) && sAmount.length > 0;
    fValidHandler(bValid);
    fSetForecast((oForecast) => {
      oForecast[sKey] = Number(sAmount);
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
      {!bProductionPlanned && (
        <Container maxWidth="xl">
          <Box sx={{ bgcolor: "rgb(250, 250, 250)", height: "900px", p: 5 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="center">
                      {t("fileupload.productionPlanning")}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    {Object.entries(oForecast).map((oProduct) => {
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
                    {Object.entries(oForecast).map((oProduct) => {
                      return (
                        <TableCell
                          t-key={oProduct[0]}
                          onChange={fUpdateForecast}
                        >
                          <Input
                            error={!bValid}
                            t-key={oProduct[0]}
                            style={{ width: "8rem" }}
                            defaultValue={oProduct[1]}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              onClick={fSendForecastForPlanning}
              disabled={!bValid}
            >
              {t("simulation.planPeriod")}
            </Button>
            {!bValid && (
              <FormHelperText id="form-helper" error>
                {t("simulation.inputInvalid")}
              </FormHelperText>
            )}
          </Box>
        </Container>
      )}
      {bProductionPlanned && (
        <Container maxWidth="xl">
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
                    <Workinghours
                      data={state.workingtimelist}
                      validate={fGlobalValidHandler}
                    />
                  )}
                  {/* {activeStep === 2 && <AdditionalOrders />} */}
                  {activeStep === 3 && <Overview data={state} />}
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
                    <Button onClick={fHandleNext} disabled={!bGlobalValid}>
                      {activeStep === aSteps.length - 1
                        ? t("simulation.finish")
                        : t("simulation.next")}
                    </Button>
                  </div>
                </Box>
              </Fragment>
            ) : (
              <Fragment></Fragment>
            )}
          </Box>
        </Container>
      )}
    </>
  );
}

export default Simulation;
