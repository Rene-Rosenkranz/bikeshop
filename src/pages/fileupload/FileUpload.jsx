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
  Box,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { redirect } from "react-router";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../components/GlobalStateProvider";
import { xml2json } from "xml-js";

function FileUpload() {
  const { t, i18n } = useTranslation("translation");
  const [oFileToUpload, fSetFileToUpload] = useState();
  const { state, setState } = useGlobalState();
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
      file.content = JSON.parse(xml2json(file.content)).elements[0];

      const oResults = {
        overview: {
          game: file.content.attributes.game,
          group: file.content.attributes.group,
          period: file.content.attributes.period,
        },
        forecast: {
          p1: file.content.elements[0].attributes.p1,
          p2: file.content.elements[0].attributes.p2,
          p3: file.content.elements[0].attributes.p3,
        },
        warehousestock: { articles: [] },
        inwardstockmovement: [],
        futureinwardstockmovement: [],
        idletimecosts: { workplaces: [], sum: {} },
        waitinglistworkstations: [],
        waitingliststock: [],
        ordersinswork: [],
        completedorders: [],
        cycletimes: [],
        result: {},
      };

      const aWarehouseStock = file.content.elements[1].elements.map(
        (oElement) => {
          if (oElement.name === "totalstockvalue") {
            oResults.warehousestock.totalstockvalue = oElement.elements[0].text;
          } else {
            return {
              id: oElement.attributes.id,
              amount: oElement.attributes.amount,
              pct: oElement.attributes.pct,
              price: oElement.attributes.price,
              startamount: oElement.attributes.startamount,
              stockvalue: oElement.attributes.stockvalue,
            };
          }
        }
      );
      oResults.warehousestock.articles = [...aWarehouseStock];

      const aInwardStockMovement = file.content.elements[2].elements.map(
        (oElement) => {
          return {
            article: oElement.attributes.article,
            amount: oElement.attributes.amount,
            entirecosts: oElement.attributes.entirecosts,
            materialcosts: oElement.attributes.materialcosts,
            mode: oElement.attributes.mode,
            ordercosts: oElement.attributes.ordercosts,
            orderperiod: oElement.attributes.orderperiod,
            time: oElement.attributes.time,
          };
        }
      );

      oResults.inwardstockmovement = [...aInwardStockMovement];

      const aFutureInwardStockMovement = file.content.elements[3].elements.map(
        (oElement) => {
          return {
            article: oElement.attributes.id,
            amount: oElement.attributes.amount,
            mode: oElement.attributes.mode,
            id: oElement.attributes.id,
            orderperiod: oElement.attributes.orderperiod,
          };
        }
      );

      oResults.futureinwardstockmovement = [...aFutureInwardStockMovement];

      const aIdleTimeCosts = file.content.elements[4].elements.map(
        (oElement) => {
          if (oElement.name === "sum") {
            const oSum = oElement.attributes;
            oResults.idletimecosts.sum = {
              idletime: oSum.idletime,
              machineidletimecosts: oSum.machineidletimecosts,
              setupevents: oSum.setupevents,
              wagecosts: oSum.wagecosts,
              wageidletimecosts: oSum.wageidletimecosts,
            };
          } else {
            return {
              id: oElement.attributes.id,
              idletime: oElement.attributes.idletime,
              machineidletimecosts: oElement.attributes.machineidletimecosts,
              setupevents: oElement.attributes.setupevents,
              wagecosts: oElement.attributes.wagecosts,
              wageidletimecosts: oElement.attributes.wageidletimecosts,
            };
          }
        }
      );

      oResults.idletimecosts.workplaces = [...aIdleTimeCosts];

      const aWaitingListWorkStations = file.content.elements[5].elements.map(
        (oElement) => {
          let aWaitingLists = [];
          if (Number(oElement.attributes.timeneed) > 0) {
            aWaitingLists = oElement.elements.map((oWaitingList) => {
              return {
                period: oWaitingList.attributes.period,
                amount: oWaitingList.attributes.amount,
                firstbatch: oWaitingList.attributes.firstbatch,
                lastbatch: oWaitingList.attributes.lastbatch,
                item: oWaitingList.attributes.item,
                order: oWaitingList.attributes.order,
                timeneed: oWaitingList.attributes.timeneed,
              };
            });
          }
          return {
            id: oElement.attributes.id,
            timeneed: oElement.attributes.timeneed,
            waitingslists: aWaitingLists,
          };
        }
      );

      oResults.waitinglistworkstations = [...aWaitingListWorkStations];

      const aWaitingListStock = file.content.elements[6].elements.map(
        (oElement) => {
          const aWorkplaces = oElement.elements.map((oWorkplace) => {
            const aWaitingLists = oWorkplace.elements.map((oWaitingList) => {
              return {
                period: oWaitingList.attributes.period,
                amount: oWaitingList.attributes.amount,
                firstbatch: oWaitingList.attributes.firstbatch,
                lastbatch: oWaitingList.attributes.lastbatch,
                item: oWaitingList.attributes.item,
                order: oWaitingList.attributes.order,
                timeneed: oWaitingList.attributes.timeneed,
              };
            });
            return {
              id: oWorkplace.attributes.id,
              timeneed: oWorkplace.attributes.timeneed,
              waitinglists: aWaitingLists,
            };
          });
          return {
            id: oElement.attributes.id,
            workplaces: aWorkplaces,
          };
        }
      );

      oResults.waitingliststock = [...aWaitingListStock];

      const aOrdersInWork = file.content.elements[7].elements.map(
        (oElement) => {
          return {
            id: oElement.attributes.id,
            amount: oElement.attributes.amount,
            batch: oElement.attributes.batch,
            item: oElement.attributes.item,
            order: oElement.attributes.order,
            period: oElement.attributes.period,
            timeneed: oElement.attributes.timeneed,
          };
        }
      );

      oResults.ordersinswork = [...aOrdersInWork];

      const aCompletedOrders = file.content.elements[8].elements.map(
        (oElement) => {
          const aBatches = oElement.elements.map((oBatch) => {
            return {
              id: oBatch.attributes.id,
              amount: oBatch.attributes.amount,
              cost: oBatch.attributes.cost,
              cycletime: oBatch.attributes.cycletime,
            };
          });
          return {
            id: oElement.attributes.id,
            averageunitcosts: oElement.attributes.averageunitcosts,
            cost: oElement.attributes.cost,
            item: oElement.attributes.item,
            period: oElement.attributes.period,
            quantity: oElement.attributes.quantity,
            batches: aBatches,
          };
        }
      );

      oResults.completedorders = [...aCompletedOrders];

      const aCycleTimes = file.content.elements[9].elements.map((oElement) => {
        return {
          id: oElement.attributes.id,
          cycletimefactor: oElement.attributes.cycletimefactor,
          cycletimemin: oElement.attributes.cycletimemin,
          finishtime: oElement.attributes.finishtime,
          period: oElement.attributes.period,
          starttime: oElement.attributes.starttime,
        };
      });

      oResults.cycletimes = [...aCycleTimes];

      file.content.elements[10].elements.forEach((oElement) => {
        oResults.result[oElement.name] = oElement.elements.reduce(
          (oAcc, oSubelement) => {
            oAcc[oSubelement.name] = {};
            Object.entries(oSubelement.attributes).forEach((aAttribute) => {
              oAcc[oSubelement.name][aAttribute[0]] = aAttribute[1];
            });
            return oAcc;
          },
          {}
        );
      });

      await axios
        .post("http:localhost:8080/api/input", oResults, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((oResponse) => {
          window.location.replace("http://localhost:5173/simulation");
        })
        .catch((oError) => {
          window.location.replace("http://localhost:5173/simulation");
        });
    };
  };

  return (
    <>
      {!bFileLoaded && (
        <Box>
          <Typography marginBottom="5rem">
            {t("fileupload.chooseResult")}
          </Typography>
          <input type="file" accept=".xml" onChange={fHandeFileChange} />
          {!!oFileToUpload && (
            <Button variant="contained" onClick={fSendFile}>
              {t("fileupload.uploadButton")}
            </Button>
          )}
        </Box>
      )}
      {/* {bFileLoaded && (
        <Button onClick={fSendFile} variant="contained">
          {t("fileupload.planSimulation")}
        </Button>
      )} */}
      {/* {bFileLoaded && (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center">
                    {t("fileupload.forecast")}
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
                  {Object.entries(oForecast).map((oProduct) => {
                    return (
                      <TableCell onChange={fUpdateXMLFile} t-key={oProduct[0]}>
                        {oProduct[1]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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
                  {Object.entries(oForecast).map((oProduct) => {
                    return (
                      <TableCell onChange={fUpdateXMLFile} t-key={oProduct[0]}>
                        <Input
                          t-key={oProduct[0]}
                          style={{ width: "8rem" }}
                          value={oProduct[1]}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )} */}
    </>
  );
}

export default FileUpload;
