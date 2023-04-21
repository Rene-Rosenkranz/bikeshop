import {
  Button,
  Input,
  TableContainer,
  TextField,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import Bike from "../../assets/Bike.png";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../components/GlobalStateProvider";

function FileUpload() {
  const { t, i18n } = useTranslation("translation");
  const [oFileToUpload, fSetFileToUpload] = useState();
  const { oState, fSetState } = useGlobalState();
  const [oForecast, fSetForecast] = useState({});
  const [bFileLoaded, fSetFileLoaded] = useState(false);
  const fHandeFileChange = (oEvent) => {
    fSetFileToUpload(oEvent.target.files[0]);
  };
  const fSendFile = async () => {
    const frXMLReader = new FileReader();
    let file = {};
    frXMLReader.readAsText(oFileToUpload);
    frXMLReader.onloadend = async (oEvent) => {
      file = {
        content: oEvent.target.result,
      };
      await axios
        .post("http:localhost:3000/URL", file, {
          headers: {
            "Content-Type": "text/xml",
          },
        })
        .then((oResponse) => {
          fSetState(oResponse.data);
        });
    };
  };
  const fUpdateXMLFile = (oUpdateEvent) => {
    const frXMLReader = new FileReader();
    let file = {};
    const sKey = oUpdateEvent.currentTarget.getAttribute("t-key");
    const sValue = oUpdateEvent.target.value;
    frXMLReader.readAsText(oFileToUpload);
    frXMLReader.onloadend = async (oUploadEvent) => {
      file = {
        content: oUploadEvent.target.result,
      };
      const dpParser = new DOMParser();
      const jqXMLFile = dpParser.parseFromString(file.content, "text/xml");

      jqXMLFile
        .getElementsByTagName("forecast")[0]
        .getAttributeNode(sKey).value = sValue;

      oUpdateEvent.target.value = sValue;
    };
  };
  const fUploadFile = () => {
    const frXMLReader = new FileReader();
    let file = {};
    frXMLReader.readAsText(oFileToUpload);
    frXMLReader.onloadend = async (oEvent) => {
      file = {
        content: oEvent.target.result,
      };
      const dpParser = new DOMParser();
      const jqXMLFile = dpParser.parseFromString(file.content, "text/xml");

      const aPeriods = ["p1", "p2", "p3"];

      aPeriods.forEach((sPeriod) => {
        oForecast[sPeriod] = jqXMLFile
          .getElementsByTagName("forecast")[0]
          .getAttributeNode(sPeriod).value;
      });

      fSetForecast(oForecast);
      fSetFileLoaded(true);
    };
  };

  return (
    <>
      {!bFileLoaded && (
        <>
          <input type="file" accept=".xml" onChange={fHandeFileChange} />
          <Button variant="contained" onClick={fUploadFile}>
            {t("fileupload.uploadButton")}
          </Button>
        </>
      )}
      {bFileLoaded && (
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
                <TableCell>{t("fileupload.product1")}</TableCell>
                <TableCell>{t("fileupload.product2")}</TableCell>
                <TableCell>{t("fileupload.product3")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {Object.entries(oForecast).map((oProduct) => (
                  <TableCell
                    contentEditable
                    onChange={fUpdateXMLFile}
                    t-key={oProduct[0]}
                  >
                    <TextField
                      t-key={oProduct[0]}
                      style={{ width: "8rem" }}
                      value={oProduct[1]}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          <Button onClick={fSendFile} variant="contained">
            {t("fileupload.planSimulation")}
          </Button>
        </TableContainer>
      )}
    </>
  );
}

export default FileUpload;
