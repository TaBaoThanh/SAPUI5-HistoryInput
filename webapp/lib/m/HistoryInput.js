sap.ui.define([
	"sap/m/Input"
], function (Input) {
	"use strict";

	var HistoryInput = Input.extend("custom.m.HistoryInput", {

		metadata: {
			properties: {
				persoNameValue: {
					type : "string",
					defaultValue : null
				},
				historyLength : {
					type : "int",
					group : "Behavior",
					defaultValue : 3
				}
			}
		},

		renderer: {},

		constructor: function () {
			Input.prototype.constructor.apply(this, arguments);
			
			if (this.getPersoNameValue()) {
				this.initPerso();
			}
			
			this.attachChange(this._onSavePersoItem, this);
		}
	});
	
	// HistoryInput.prototype.onfocusin = function(oEvent) {
	// 	if (!this._getSuggestionsPopover().getPopover().isOpen() && !this._ignoreSuggestionItems) {
	// 		Input.prototype.onfocusin.apply(this, arguments);
	// 		this._ignoreSuggestionItems	= true
	// 		this.showItems();
	// 		setTimeout(function () {
	// 			this._ignoreSuggestionItems	= false;
	// 		}.bind(this), 1000);
	// 	}
	// };
	
	HistoryInput.prototype.initPerso = function () {
		var that = this;
		var sItemName = this.getPersoNameValue();
		var oServicePromise = sap.ushell.Container.getServiceAsync("Personalization").then(function (oService) {
			return oService;
		});
		var oContainerPromise = oServicePromise.then(function (oService) {
			return oService.getContainer("ImportOption");
		});
		$.when(oContainerPromise).then(function (oContainer) {
			that.oContainer = oContainer;
			if (!oContainer.containsItem(sItemName)) {
				oContainer.setItemValue(sItemName, []);
				oContainer.save();
			} else {
				that.removeAllSuggestionItems();
				oContainer.getItemValue(sItemName).forEach(function(item) {
					that.addSuggestionItem(new sap.ui.core.Item({key: item, text: item}));
				});
			}
		});
	},
	
	HistoryInput.prototype._onSavePersoItem = function () {
		if (!this.oContainer || this.getValue() === "") {
			return;
		}
		
		this.oContainer.load().then(function() {
			var oContainer = this.oContainer;
			var sItemName = this.getPersoNameValue();
			var aInputItems = oContainer.getItemValue(sItemName);
			
			aInputItems.unshift(this.getValue());
			
			if (aInputItems.length > this.getHistoryLength()) {
				aInputItems.length = this.getHistoryLength();
			}
			
			this.removeAllSuggestionItems();
			aInputItems.forEach(function(item) {
				this.addSuggestionItem(new sap.ui.core.Item({key: item, text: item}));
			}.bind(this));
			
			oContainer.setItemValue(sItemName, aInputItems);
			oContainer.save();
		}.bind(this));
	}
	
	return HistoryInput;

});