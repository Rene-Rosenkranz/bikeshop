import React, { Fragment, useState } from "react";
import {
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
  const aSteps = [
    t("simulation.delivery"),
    t("simulation.production"),
    t("simulation.additionalOrder"),
  ];
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
          {activeStep === 0 ? (
            <Fragment>
              <Typography>Step {activeStep + 1}</Typography>
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
