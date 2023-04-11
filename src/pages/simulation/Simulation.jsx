import React, { Fragment, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  Input,
  Step,
  StepLabel,
  TextField,
  Stepper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";

function Simulation() {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const aSteps = [
    t("simulation.delivery"),
    t("simulation.production"),
    t("simulation.additionalOrder"),
    t("simulation.shifts"),
    t("simulation.overview"),
  ];

  const fIsStepOptional = (step) => {
    return step === aSteps.length - 2;
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
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={fHandleBack}
                  sx={{ mr: 1 }}
                >
                  {t("simulation.back")}
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {fIsStepOptional(activeStep) && (
                  <Button color="inherit" onClick={fHandleSkip} sx={{ mr: 1 }}>
                    {t("simulation.skip")}
                  </Button>
                )}
                <Button onClick={fHandleNext}>
                  {activeStep === aSteps.length - 1
                    ? t("simulation.finish")
                    : t("simulation.next")}
                </Button>
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
