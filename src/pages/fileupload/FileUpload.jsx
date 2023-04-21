import {
  Button,
  Input,
  TableContainer,
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
  const fSendFile = () => {};
  const fUpdateXMLFile = () => {};
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

      /* await axios
        .post("/URL", file, {
          headers: {
            "Content-Type": "text/xml",
          },
        })
        .then((oResponse) => {
          fSetState(oResponse.data);
        }); */
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
                <TableCell>{t("fileupload.productionPlanning")}</TableCell>
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
                    key={oProduct[0]}
                  >
                    {oProduct[1]}
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
