sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  (Controller, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    return Controller.extend("h7.hamzio7.leaverequests.controller.Main", {
      onInit() {
        this._oModel = this.getOwnerComponent().getModel();

        this._oNewRequestModel = new JSONModel({
          EmployeeId: "",
          StartDate: null,
          EndDate: null,
          Status: "Pending",
        });

        this.getView().setModel(this._oNewRequestModel, "newRequest");
      },
      onOpenDialog: function () {
        const that = this;

        if (!this.oDialog) {
          this.loadFragment({
            name: "h7.hamzio7.leaverequests.view.AddRequest",
          }).then(function (oDialog) {
            that.oDialog = oDialog;
            that.oDialog.open();
          });
        } else {
          this.oDialog.open();
        }
      },

      openRequestDialog() {
        if (!this._oRequestDialog) {
          this._oRequestDialog = this.getView().byId("requestDialog");
        }
        this._oNewRequestModel.setData({
          EmployeeId: "",
          StartDate: null,
          EndDate: null,
          Status: "Pending",
        });
        this._oRequestDialog.open();
      },

      closeRequestDialog() {
        if (this.oDialog) {
          this.oDialog.close();
        }
      },

      createLeaveRequest() {
        const data = this._oNewRequestModel.getData();

        // Validate required fields
        if (!data.EmployeeId || !data.StartDate || !data.EndDate) {
          MessageBox.error("Please fill in all required fields.");
          return;
        }

        // Generate RequestId
        const requestId = this._generateRequestId();

        const oNewLeaveRequest = {
          RequestId: requestId,
          EmployeeId: data.EmployeeId,
          StartDate: this._formatDate(data.StartDate),
          EndDate: this._formatDate(data.EndDate),
          Status: data.Status,
        };

        this._oModel.create("/LeaveRequestSet", oNewLeaveRequest, {
          success: () => {
            MessageToast.show("Leave request created successfully.");
            this._oModel.refresh(true);
            this.closeRequestDialog();
          },
          error: (oError) => {
            MessageBox.error("Failed to create leave request.");
            console.error(oError);
          },
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
