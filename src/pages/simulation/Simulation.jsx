import React, { Fragment, useState } from "react";
import {
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import DeliveryProgram from "./components/DeliveryProgram";
import ProductionProgram from "./components/ProductionProgram";
import Workinghours from "./components/Workhours";
import Overview from "./components/Overview";

function Simulation() {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const aSteps = [
    t("simulation.delivery"),
    t("simulation.production"),
    t("simulation.shifts"),
    t("simulation.overview"),
  ];
  //const { oSimulationData } = useGlobalState();
  const oSimulationData = {
    orders: [
      {
        part: 21,
        amount: 600,
        mode: 5,
      },
      {
        part: 22,
        amount: 900,
        mode: 5,
      },
      {
        part: 23,
        amount: 1800,
        mode: 4,
      },
      {
        part: 40,
        amount: 22000,
        mode: 3,
      },
    ],
    production: [
      {
        part: 1,
        amount: 150,
      },
      {
        part: 2,
        amount: 100,
      },
      {
        part: 3,
        amount: 150,
      },
    ],
    workinghours: [
      {
        workplace: 1,
        shift: 1,
        overtime: 0,
      },
      {
        workplace: 2,
        shift: 2,
        overtime: 15,
      },
      {
        workplace: 3,
        shift: 1,
        overtime: 30,
      },
      {
        workplace: 4,
        shift: 1,
        overtime: 45,
      },
      {
        workplace: 5,
        shift: 0,
        overtime: 0,
      },
      {
        workplace: 6,
        shift: 1,
        overtime: 40,
      },
    ],
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
                    disabled={activeStep === 0}
                    onClick={fHandleBack}
                    sx={{ mr: 1 }}
                  >
                    {t("simulation.back")}
                  </Button>
                </div>
                {activeStep === 0 && (
                  <DeliveryProgram data={oSimulationData.orders} />
                )}
                {activeStep === 1 && (
                  <ProductionProgram data={oSimulationData.production} />
                )}
                {activeStep === 2 && (
                  <Workinghours data={oSimulationData.workinghours} />
                )}
                {/* {activeStep === 2 && <AdditionalOrders />} */}
                {activeStep === 3 && <Overview data={oSimulationData} />}
                <Box sx={{ flex: "1 1 auto" }} />
                <div>
                  {fIsStepOptional(activeStep) && (
                    <Button
                      color="inherit"
                      onClick={fHandleSkip}
                      sx={{ mr: 1 }}
                    >
                      {t("simulation.skip")}
                    </Button>
                  )}
                </div>
                <div>
                  <Button onClick={fHandleNext}>
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
    </>
  );
}

export default Simulation;
