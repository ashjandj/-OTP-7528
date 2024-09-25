/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/message'],
/**
 * @param{record} record
 * @param{search} search
 * @param{message} message
 */
function(record, search, message) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

       
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
        try{
                      
            let salesOrderId = scriptContext.currentRecord.getValue({
                fieldId : "createdfrom"
            });
            let totalCustomerDeposit = getCustomerDepositForSalesOrder(salesOrderId);
            let totalamount =  getCustomerTotalAmount(salesOrderId);
            if(totalCustomerDeposit >= totalamount)
            {
                return true;
            }else{
                let myMsg = message.create({
                    title: "Item Fulfillment Restrictions", 
                    message: "Item Fulfillment can only be saved for sales orders in Pending Fulfillment status if a customer deposit exists and is greater than or equal to the sales order total. If these conditions are not met, saving will be restricted.", 
                    type: message.Type.ERROR
                });
                myMsg.show();
                return false;
            }
            
            
           }catch(err)
           {
            console.log("Error fetching sales order id");
           }

    }

    function getCustomerDepositForSalesOrder(salesOrderNum)
    {
        try{
            let customerDepositSearch = search.create({
                type: search.Type.CUSTOMER_DEPOSIT,
                title: 'JJ SALES ORDER Search053',
                id: 'customsearch_jj_so_otp_059',
                columns: [{
                    name: 'salesorder'
                },
                {
                    name: 'amount'
                },
                {
                    name: 'status'
                }
                ]
                , filters: [
                    ["mainline", "is", ['T']],
                    "AND",
                    ["salesorder", "anyof", salesOrderNum],
                    "AND",
                    ["status","anyof",["CustDep:A","CustDep:B"]]
                ]
    
            });
            // customerDepositSearch.save();
            let totalamount = 0.0;
            customerDepositSearch.run().each(function (result) {
                let amount = result.getValue({
                    name:"amount"
                });
                totalamount = parseFloat(totalamount)+ parseFloat(amount);
                return true;
            });
            return totalamount;
        }catch(err)
        {
            log.error("search Error",err);
        }
    }


    function getCustomerTotalAmount(salesOrderId)
    {
        try{
            let salesOrderLookUp = search.lookupFields({
                type: search.Type.SALES_ORDER,
                id: salesOrderId,
                columns: ['total']
            });

            return salesOrderLookUp.total


        }catch(err)
        {
            log.error("Error fetching total amount", err)
        }
    }

    return {
        // pageInit: pageInit,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
          saveRecord: saveRecord
    };
    
});
