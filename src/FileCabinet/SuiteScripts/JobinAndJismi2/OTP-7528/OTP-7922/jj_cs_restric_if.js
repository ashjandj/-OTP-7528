/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 *  * Client Name: Nil
 * 
 * Jira Code: OTP-7866
 * 
 * Title: Restrict IF save
 * 
 * Author: Jobin And Jismi IT Services LLP
 * 
 * Date Created: 2024-09-25
 *
 * Script Description:
 * Restrict item fulfillment for sales orders in Pending Fulfillment status without a customer deposit equal to or greater than the order total.
 * The restriction applies only when using the Sales Order UI.
 * It does not affect the bulk fulfill option on the Fulfill Orders page.
 * 

 * 
 * Revision History: 1.0
 
 */
define(['N/record', 'N/search', 'N/ui/message'],
    /**
     * @param{record} record
     * @param{search} search
     * @param{message} message
     */
    function (record, search, message) {

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
            try {

                let salesOrderId = scriptContext.currentRecord.getValue({
                    fieldId: "createdfrom"
                });
                let totalCustomerDeposit = getCustomerDepositForSalesOrder(salesOrderId);
                let totalamount = getCustomerTotalAmount(salesOrderId);
                if(!totalCustomerDeposit)
                {
                    return true;
                }
                if (totalCustomerDeposit > totalamount || totalCustomerDeposit == 0.0) {
                    return true;
                } else {
                    let myMsg = message.create({
                        title: "Item Fulfillment Restrictions",
                        message: "Item Fulfillment can only be saved for sales orders in Pending Fulfillment status if a customer deposit exists and is greater than or equal to the sales order total. If these conditions are not met, saving will be restricted.",
                        type: message.Type.ERROR
                    });
                    myMsg.show();
                    return false;
                }


            } catch (err) {
                log.error("Error fetching sales order id", err);
            }

        }

        
        /**
         * Retrieves the total customer deposit amount associated with a given sales order.
         *
         * This function searches for customer deposits linked to the specified sales order number 
         * and sums the amounts of those deposits if they are in either "Pending" or "Completed" status.
         *
         * @param {string} salesOrderNum - The internal ID of the sales order for which to find customer deposits.
         * @returns {number} The total amount of customer deposits for the specified sales order, or 0 if none found.
         * @throws {Error} If an error occurs during the search operation, an error is logged.
         *
         * @example
         * const totalDeposit = getCustomerDepositForSalesOrder('12345');
         * console.log(totalDeposit); // Outputs the total customer deposit for sales order 12345
         */
        function getCustomerDepositForSalesOrder(salesOrderNum) {
            try {
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
                        ["status", "anyof", ["CustDep:A", "CustDep:B"]]
                    ]

                });
                // customerDepositSearch.save();
                let totalamount = 0.0;
                customerDepositSearch.run().each(function (result) {
                    let amount = result.getValue({
                        name: "amount"
                    });
                    totalamount = parseFloat(totalamount) + parseFloat(amount);
                    return true;
                });
                return totalamount;
            } catch (err) {
                log.error("search Error", err);
            }
        }


        /**
         * Retrieves the total amount of a specified sales order.
         *
         * This function looks up the total amount for a given sales order ID using the NetSuite search API.
         *
         * @param {string} salesOrderId - The internal ID of the sales order to look up.
         * @returns {number|undefined} The total amount of the sales order, or undefined if an error occurs.
         * @throws {Error} If an error occurs during the lookup operation, an error is logged.
         *
         * @example
         * const totalAmount = getCustomerTotalAmount('12345');
         * console.log(totalAmount); // Outputs the total amount of sales order 12345
         */

        function getCustomerTotalAmount(salesOrderId) {
            try {
                let salesOrderLookUp = search.lookupFields({
                    type: search.Type.SALES_ORDER,
                    id: salesOrderId,
                    columns: ['total']
                });

                return salesOrderLookUp.total


            } catch (err) {
                log.error("Error fetching total amount", err)
            }
        }

        return {
            saveRecord: saveRecord
        };

    });
