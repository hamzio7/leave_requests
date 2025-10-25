sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "./DialogHelper",
  ],
  (Controller, MessageToast, MessageBox, JSONModel, DialogHelper) => {
    "use strict";

    return Controller.extend("h7.hamzio7.leaverequests.controller.Request", {
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

      onSavePress() {
        this._dialogHelper.handleSavePress(this);
      },

      onCancelPress() {
        this._dialogHelper.handleCancelPress(this);
      },

      onDeletePress(oEvent) {
        const oItem = oEvent.getSource().getParent().getParent();
        const oContext = oItem.getBindingContext();
        const sPath = oContext.getPath();
        MessageBox.confirm(
          "Are you sure you want to delete this leave request?",
          {
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.OK) {
                this._oModel.remove(sPath, {
                  success: () => {
                    MessageToast.show("Leave request deleted successfully.");
                    this._oModel.refresh(true);
                  },
                  error: (oError) => {
                    MessageBox.error("Failed to delete leave request.");
                    console.error(oError);
                  },
                });
              }
            },
          }
        );
      },

      onEditPress(oEvent) {
        const oItem = oEvent.getSource().getParent().getParent();
        const oContext = oItem.getBindingContext();
        const oData = { ...oContext.getObject() }; // clone data to avoid unwanted binding
        this._editPath = oContext.getPath();
        this._isEdit = true;
        this._oNewRequestModel.setData(oData);

        if (!this.oDialog) {
          this.loadFragment({
            name: "h7.hamzio7.leaverequests.view.AddRequest",
          }).then((oDialog) => {
            this.oDialog = oDialog;
            this.getView().addDependent(oDialog);
            this.oDialog.open();
          });
        } else {
          this.oDialog.open();
        }
      },

      onShowPress(oEvent) {
        const oItem = oEvent.getSource();
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail", {
          requestPath: window.encodeURIComponent(
            oItem.getBindingContext().getPath().substring(1)
          ),
        });
      },

      _generateRequestId() {
        const now = new Date();
        return (
          "REQ" +
          now.getFullYear().toString().slice(-2) +
          ("0" + (now.getMonth() + 1)).slice(-2) +
          ("0" + now.getDate()).slice(-2) +
          ("0" + now.getHours()).slice(-2) +
          ("0" + now.getMinutes()).slice(-2) +
          ("0" + now.getSeconds()).slice(-2)
        );
      },

      _formatDate(oDate) {
        if (!oDate) return null;

        if (typeof oDate === "string" || oDate instanceof String) {
          oDate = new Date(String(oDate));
        }

        if (!(oDate instanceof Date) || isNaN(oDate.getTime())) {
          return null;
        }

        const yyyy = oDate.getFullYear();
        const mm = ("0" + (oDate.getMonth() + 1)).slice(-2);
        const dd = ("0" + oDate.getDate()).slice(-2);
        return `${yyyy}-${mm}-${dd}`;
      },
    });
  }
);
