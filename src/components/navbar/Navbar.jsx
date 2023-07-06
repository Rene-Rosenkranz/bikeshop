import * as React from "react";
import {
  Box,
  Drawer,
  ListItemButton,
  ListItemText,
  List,
  Toolbar,
  CssBaseline,
  AppBar,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { t, i18n } = useTranslation("translation");
  let [sLanguage, fSetLanguage] = React.useState(i18n.language.toLowerCase());
  const fChangeToSelectedLanguage = (oEvent) => {
    const sLanguage = oEvent.target.value;
    fSetLanguage(sLanguage);
    i18n.changeLanguage(sLanguage);
  };
  const menuItems = [
    {
      name: t("navbar.home"),
      path: "/",
    },
    {
      name: t("navbar.upload"),
      path: "/upload",
    },
    {
      name: t("navbar.simulation"),
      path: "/simulation",
    },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar
          style={{ backgroundColor: "rgb(30, 60, 90)", maxHeight: "5vh" }}
        >
          <div style={{ marginLeft: "auto", marginRight: 20, display: "flex" }}>
            <Typography>{t("navbar.appTitle")}</Typography>
          </div>
          <Select onChange={fChangeToSelectedLanguage} value={sLanguage}>
            <MenuItem value={"de"}>
              <Typography sx={{ color: "grey" }}>
                {t("navbar.german")}
              </Typography>
            </MenuItem>
            <MenuItem value={"en"}>
              <Typography sx={{ color: "grey" }}>
                {t("navbar.english")}
              </Typography>
            </MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 150,
            boxSizing: "border-box",
            backgroundColor: "rgb(240, 240, 240)",
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: "auto",
          }}
        >
          <List
            style={{
              backgroundColor: "rgb(17, 17, 17)",
              minHeight: "65vh",
              paddingTop: "unset",
            }}
          >
            {menuItems.map((oItem) => (
              <NavbarItem name={oItem.name} path={oItem.path} />
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

function NavbarItem(props) {
  return (
    <Link
      key={props.name}
      to={props.path}
      style={{
        textDecoration: "none",
        color: "white",
      }}
    >
      <ListItemButton sx={{ backgroundColor: "rgb(40, 40, 40)" }}>
        <ListItemText>{props.name}</ListItemText>
      </ListItemButton>
    </Link>
  );
}
export default Navbar;
