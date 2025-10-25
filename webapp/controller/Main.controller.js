sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "./DialogHelper",
  ],
  (Controller, JSONModel, DialogHelper) => {
    "use strict";

    return Controller.extend("h7.hamzio7.leaverequests.controller.Main", {
      onInit() {
        this._oModel = this.getOwnerComponent().getModel();
        this._dialogHelper = new DialogHelper(this._oModel);
        this._oNewRequestModel = new JSONModel({
          EmployeeId: "",
          StartDate: null,
          EndDate: null,
          Status: "Pending",
        });

        this.getView().setModel(this._oNewRequestModel, "newRequest");
      },
      onOpenDialog: function () {
        if (!this.oDialog) {
          this.loadFragment({
            name: "h7.hamzio7.leaverequests.view.AddRequest",
          }).then((oDialog) => {
            this.oDialog = oDialog;
            this.getView().addDependent(oDialog);
            oDialog.open();
          });
        } else {
          this.oDialog.open();
        }
      },
      onSavePress() {
        this._dialogHelper.handleSavePress(this);
      },
      onCancelPress() {
        this._dialogHelper.handleCancelPress(this);
      },
    });
  }
);
