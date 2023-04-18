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
    {
      name: t("navbar.overview"),
      path: "/results",
    },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar
          style={{ backgroundColor: "rgb(30, 60, 90)", maxHeight: "5vh" }}
        >
          <div style={{ marginLeft: "auto", marginRight: 0, display: "flex" }}>
            <Typography>{t("navbar.appTitle")}</Typography>
          </div>
          <Select onChange={fChangeToSelectedLanguage} value={sLanguage}>
            <MenuItem value={"de"}>{t("navbar.german")}</MenuItem>
            <MenuItem value={"en"}>{t("navbar.english")}</MenuItem>
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
