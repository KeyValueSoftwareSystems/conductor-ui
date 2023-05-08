import React from "react";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ClickAwayListener, Popper, MenuItem, MenuList } from "@mui/material";
import { Paper } from "./";

export default function DropdownButton({ children, options }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        ref={anchorRef}
        onClick={handleToggle}
      >
        {children} <ArrowDropDownIcon />
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        disablePortal
        placement="bottom-end"
      >
        <Paper elevation={1}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList>
              {options.map(({ label, handler }, index) => (
                <MenuItem
                  key={index}
                  onClick={(event) => {
                    handler(event, index);
                    setOpen(false);
                  }}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </React.Fragment>
  );
}
