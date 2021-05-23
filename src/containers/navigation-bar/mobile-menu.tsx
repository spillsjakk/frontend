import React, { FunctionComponent, useState } from "react";
import { IconButton, Menu } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { MobileLinks } from "./links";

const MobileMenu: FunctionComponent<unknown> = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          id="navigation-menu-icon"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <Menu
        anchorEl={document.getElementById("navigation-menu-icon")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <MobileLinks />
      </Menu>
    </>
  );
};

export { MobileMenu };
