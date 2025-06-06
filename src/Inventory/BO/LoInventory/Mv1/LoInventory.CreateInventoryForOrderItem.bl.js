"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function createInventoryForOrderItem
 * @this LoInventory
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {LiOrderItem} orderItem
 * @param {Object} ivcInformation
 * @param {String} recordTypeId
 * @returns ivcMainPKey
 */
function createInventoryForOrderItem(orderItem, ivcInformation, recordTypeId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var ivcMetaByItemMeta;
var ivcMainPKey;
var jsonIvcData = {};
var productId = me.fetchProductId(orderItem);

ivcMetaByItemMeta = ivcInformation.ivcMetaByItemMeta;

// Consider only UserInventories
if(Utils.isDefined(ivcMetaByItemMeta)) {
  if ((ivcMetaByItemMeta.getMetaId() === "UserInventory" && !Utils.isEmptyString(recordTypeId)) ||
      ivcMetaByItemMeta.getMetaId() === "Unsalable"){

    //check if inventory is already available in list
    //e.g. if different item metas in same order (std, return) first item creates inventory second item has to reuse it
    var inventoryItems = me.getAllItems();
    for(var i = 0; i < inventoryItems.length; i++) {
      var currentInventoryItem = inventoryItems[i];
      if(currentInventoryItem.getIvcMetaPKey() === ivcMetaByItemMeta.getIvcMetaPKey() &&
         currentInventoryItem.getUsrMainPKey() === ivcMetaByItemMeta.getUsrMainPKey() &&
         currentInventoryItem.getBpaMainPKey() === ivcMetaByItemMeta.getBpaMainPKey() &&
         currentInventoryItem.getPrdMainPKey() === productId &&
         currentInventoryItem.getTmgTourPKey() === ivcMetaByItemMeta.getTmgTourPKey() &&
         currentInventoryItem.getEtpVehiclePKey() === ivcMetaByItemMeta.getEtpVehiclePKey()) {
        ivcMainPKey = currentInventoryItem.getPKey();
        break;
      }
    }

    if(!Utils.isDefined(ivcMainPKey)) {
      ivcMainPKey = PKey.next();
      // Create inventory
      jsonIvcData = {};
      jsonIvcData.pKey = ivcMainPKey;
      jsonIvcData.ivcMetaPKey = ivcMetaByItemMeta.getIvcMetaPKey();
      jsonIvcData.usrMainPKey = ivcMetaByItemMeta.getUsrMainPKey();
      jsonIvcData.bpaMainPKey = ivcMetaByItemMeta.getBpaMainPKey();
      jsonIvcData.prdMainPKey = productId;
      jsonIvcData.phase = "Active";
      jsonIvcData.validFrom = Utils.createAnsiDateToday();
      jsonIvcData.validThru = Utils.getMaxDate();
      jsonIvcData.invalid = "0";
      jsonIvcData.salesOrg = ApplicationContext.get('user').getBoUserSales().getSalesOrg();
      jsonIvcData.tmgTourPKey = ivcMetaByItemMeta.getTmgTourPKey();
      jsonIvcData.etpVehiclePKey = ivcMetaByItemMeta.getEtpVehiclePKey();
      jsonIvcData.recordTypeId = recordTypeId;

      me.addItems([jsonIvcData]);
      me.getItemByPKey(jsonIvcData.pKey).setObjectStatus(STATE.NEW | STATE.DIRTY);
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return ivcMainPKey;
}