sap.ui.define(
  ["sap/m/MessageToast", "sap/m/MessageBox"],
  function (MessageToast, MessageBox) {
    "use strict";

    return class DialogHelper {
      constructor(oModel) {
        this._oModel = oModel;
      }

      handleSavePress(oController) {
        const data = oController.getView().getModel("newRequest").getData();
        if (!this.validateRequest(data)) {
          MessageBox.error("Please fill in all required fields.");
          return;
        }

        if (oController._isEdit) {
          console.log("is In Edit Mode!");

          this.updateLeaveRequest(
            this._oModel,
            data,
            oController._editPath,
            () => {
              MessageToast.show("Leave request updated successfully.");
              oController._isEdit = false; // reset edit mode
              oController._editPath = null; // reset path
              oController.onCancelPress();
              this._oModel.refresh(true);
            },
            () => {
              MessageBox.error("Failed to update leave request.");
            }
          );
        } else {
          this.createLeaveRequest(
            this._oModel,
            data,
            () => {
              MessageToast.show("Leave request created successfully.");
              oController.onCancelPress();
              this._oModel.refresh(true);
            },
            () => {
              MessageBox.error("Failed to create leave request.");
            }
          );
        }
      }

      updateLeaveRequest(oModel, data, sPath, fnSuccess, fnError) {
        console.log(sPath);
        const payload = {
          StartDate: data.StartDate,
          EndDate: data.EndDate,
          Status: data.Status || "Pending",
        };
        oModel.update(sPath, payload, {
          success: fnSuccess,
          error: fnError,
        });
      }

      handleCancelPress(oController) {
        if (oController.oDialog) {
          oController.oDialog.close();
        }
      }

      validateRequest(data) {
        return !!(data.EmployeeId && data.StartDate && data.EndDate);
      }

      createLeaveRequest(oModel, data, fnSuccess, fnError) {
        const payload = {
          RequestId: 'REQ' + data.EmployeeId + Date.now(),
          EmployeeId: data.EmployeeId,
          StartDate: data.StartDate,
          EndDate: data.EndDate,
          Status: data.Status || "Pending",
        };
        oModel.create("/LeaveRequestSet", payload, {
          success: fnSuccess,
          error: fnError,
        });
      }
    };
  }
);
