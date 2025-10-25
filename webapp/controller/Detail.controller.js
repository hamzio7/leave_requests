sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox"],
  (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("h7.hamzio7.leaverequests.controller.Detail", {
      onInit() {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("detail")
          .attachPatternMatched(this.onObjectMatched, this);
      },

      onObjectMatched(oEvent) {
        const sPath =
          "/" +
          window.decodeURIComponent(
            oEvent.getParameter("arguments").requestPath
          );
        this.getView().bindElement({
          path: sPath,
          error: (oError) => {
            MessageBox.error("Failed to delete leave request.");
            console.error(oError);
          },
        });
      },
    });
  }
);
