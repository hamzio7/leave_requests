sap.ui.define([
    "sap/ui/core/UIComponent",
    "h7/hamzio7/leaverequests/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("h7.hamzio7.leaverequests.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});