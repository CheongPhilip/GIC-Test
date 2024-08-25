import { FC } from "react";
import { AgGridReact, AgGridReactProps } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const Table: FC<AgGridReactProps> = (props) => {
  return (
    <div className={"ag-theme-quartz-dark"} style={{ height: 700 }}>
      <AgGridReact {...props} />
    </div>
  );
};
