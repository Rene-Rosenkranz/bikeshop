import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import { useGlobalState } from "../../../components/GlobalStateProvider";
import { useTranslation } from "react-i18next";

function Overview(props) {
  const { oState, fSetState } = useGlobalState();
  const { t, i18n } = useTranslation();

  // Anzeigen der Daten für
  // 1. Lieferungen
  // 2. Produktion
  // 3. Workhours
  const mModeMap = new Map([
    [1, t("simulation.shippingMethods.specialDelivery")],
    [2, t("simulation.shippingMethods.cheapVendor")],
    [3, t("simulation.shippingMethods.JIT")],
    [4, t("simulation.shippingMethods.fast")],
    [5, t("simulation.shippingMethods.normal")],
  ]);

  return (
    <>
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("simulation.part")}</TableCell>
                <TableCell>{t("simulation.amount")}</TableCell>
                <TableCell>{t("simulation.mode")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.orders.map((oOrder) => (
                <TableRow key={oOrder.part}>
                  <TableCell>{oOrder.part}</TableCell>
                  <TableCell>{oOrder.amount}</TableCell>
                  <TableCell>{mModeMap.get(oOrder.mode)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("simulation.part")}</TableCell>
                <TableCell>{t("simulation.amount")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.production.map((oOrder) => (
                <TableRow key={oOrder.part}>
                  <TableCell>{oOrder.part}</TableCell>
                  <TableCell>{oOrder.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("simulation.workstation")}</TableCell>
                <TableCell>{t("simulation.shifts")}</TableCell>
                <TableCell>{t("simulation.overtime")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.workinghours.map((oOrder) => (
                <TableRow key={oOrder.workplace}>
                  <TableCell>{oOrder.workplace}</TableCell>
                  <TableCell>{oOrder.shift}</TableCell>
                  <TableCell>{oOrder.overtime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
export default Overview;
