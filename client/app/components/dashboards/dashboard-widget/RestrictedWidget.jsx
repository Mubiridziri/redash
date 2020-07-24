import React from "react";
import Widget from "./Widget";

function RestrictedWidget(props) {
  return (
    <Widget {...props} className="d-flex justify-content-center align-items-center widget-restricted">
      <div className="t-body scrollbox">
        <div className="text-center">
          <h1>
            <span className="zmdi zmdi-lock" />
          </h1>
          <p className="text-muted">Этот виджет требует доступа к источнику данных, к которому у вас нет доступа.</p>
        </div>
      </div>
    </Widget>
  );
}

export default RestrictedWidget;
