import React, { useState } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

//Deze module zorgt voor de datepicker in de overview tabel, deze code komt van stackoverflow ...
//en wordt geïmplementeerd in Overview.js (filterComponent: (props) => <CustomDatePicker {...props} /> )

export const CustomDatePicker = (props) => {
  const [date, setDate] = useState(null);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        className="datepicker"
        margin="normal"
        id="date-picker-dialog"
        label="Pick a date"
        format="dd/MM/yyyy"
        clearable
        value={date}
        onChange={(event) => {
          if (!isNaN(new Date(event).getDate())) {
            setDate(event);
            props.onFilterChanged(props.columnDef.tableData.id, event);
          }
        }}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
};
