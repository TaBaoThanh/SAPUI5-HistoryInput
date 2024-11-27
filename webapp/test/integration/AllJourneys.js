/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/m/custom/HistoryInput/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"sap/m/custom/HistoryInput/test/integration/pages/Main",
	"sap/m/custom/HistoryInput/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.m.custom.HistoryInput.view.",
		autoWait: true
	});
});