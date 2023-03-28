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
} from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  const menuItems = [
    {
      name: "Home",
      path: "/home",
    },
    {
      name: "Simulation",
      path: "/simulation",
    },
    {
      name: "Marktplatz",
      path: "/marketplace",
    },
    {
      name: "Ergebnisse",
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
            <Typography>Supply Chain Management</Typography>
          </div>
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
      }}
    >
      <ListItemButton>
        <ListItemText
          sx={{
            color: "white",
            fontWeight: "400",
          }}
        >
          {props.name}
        </ListItemText>
      </ListItemButton>
    </Link>
  );
}
export default Navbar;
