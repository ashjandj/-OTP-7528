/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *  *  ************************************************************************************************************************************
 * Client Name: Nil
 * 
 * Jira Code: RAF
 * 
 * Title: Custom page for display sales order based on the status
 * 
 * Author: Jobin And Jismi IT Services LLP
 * 
 * Date Created: Sep 20, 2024
 *
 * Script Description:
 * Create an online form for sales order creation using NetSuite's SuiteScript. The form should include the following details at the body level
 *
 * In the item sublist, the following features are required:
 * A facility for choosing items from the NetSuite account.
 * Display item descriptions pulled from the item record.
 * Each item must include mandatory Quantity and Price fields. The price needs to be sourced from the item's base price, and an Amount field should calculate the total (Amount = Price × Quantity).
 * Users should not be allowed to commit items without entering both the quantity and price.
 *
 *Upon clicking the submit button, the system should check for duplicate customers in NetSuite using the entered email address. If the customer already exists, create a sales order for the existing customer. If the customer does not exist, create a new customer and generate a sales order for that customer.
 * 
 * 
 * Revision History: 1.0
 *************************************************************************************************************************************8

 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = createSalesOrederForm();
                try {
                    scriptContext.response.writePage(form);
                } catch (err) {
                    log.error("Error creating Form", err);
                    scriptContext.response.write(`<h1 style= "color:red">Something went wrong</h1>`);
                }
            }else{
                scriptContext.response.write(`<h1 style= "color:red">Record Has Been Created</h1>`);

            }
        }
        /** 
        * @function salesOrderFilterForm
        * @returns {serverWidget} The created form object containing select fields for subsidiaries, departments, customers, and status,
        *                   along with a sublist displaying relevant sales order details.
        * @throws {Error} Throws an error if there is an issue creating the form or populating its fields.
        *
        */
        function createSalesOrederForm() {
            try {
                let salesOrderForm = serverWidget.createForm({
                    title: 'Create Sales Order'
                });

                let firstName = salesOrderForm.addField({
                    id: 'custpage_jj_first_name_raf',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                });
                firstName.isMandatory = true;
                let lastName = salesOrderForm.addField({
                    id: 'custpage_jj_last_name_raf',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });
                lastName.isMandatory = true;
                let emailOfCustomer = salesOrderForm.addField({
                    id: 'custpage_jj_email_raf',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                emailOfCustomer.isMandatory = true;
                let phoneNumber = salesOrderForm.addField({
                    id: 'custpage_jj_phone_raf',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });
                phoneNumber.isMandatory = true;
                let subsidiary = salesOrderForm.addField({
                    id: 'custpage_jj_subsidiary',
                    type: serverWidget.FieldType.TEXT,
                    label: 'subsidiary'
                });
                let internalid = salesOrderForm.addField({
                    id: 'custpage_jj_internalid',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'InternalID'
                });
               
                
                let itemSublistraf = salesOrderForm.addSublist({
                    id: 'custpage_jj_so_sublist_raf',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'Sales Orders'
                });
                // itemSublistraf.isMandatory = true;
                let sublistofitem = itemSublistraf.addField({
                    id: 'custpage_jj_item_name',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Item Name',
                });
                //itemsearch
                let itemSearchObj = search.create({
                    type: "item",
                    columns:
                    [
                       search.createColumn({name: "itemid", label: "Name"}),
                       search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
                 });
                 let searchResultCount = itemSearchObj.runPaged().count;
                 log.debug("itemSearchObj result count",searchResultCount);
                 itemSearchObj.run().each(function(result){
                    let itemid = result.getValue({
                        name : "itemid"
                    })
                    let internalId = result.getValue({
                        name : "internalid"
                    })

                    sublistofitem.addSelectOption({
                        value: internalId,
                        text: itemid
                    });
                    return true;
                 });
                 
                
                itemSublistraf.addField({
                    id: 'custpage_jj_item_desc',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Item Description'
                });
                let quantity = itemSublistraf.addField({
                    id: 'custpage_jj_quantity',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Quantity'
                });
                quantity.isMandatory =true;
                let price = itemSublistraf.addField({
                    id: 'custpage_jj_price',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Price'
                });
                price.isMandatory = true;
                itemSublistraf.addField({
                    id: 'custpage_jj_amount',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Amount'
                });
                salesOrderForm.addSubmitButton({
                    label: 'Submit'
                });
                salesOrderForm.clientScriptModulePath = "SuiteScripts/JobinAndJismi2/RAF EVALUTION/jj_cs_sales_order_raf_ev.js"
                return salesOrderForm;
            } catch (err) {
                log.error("Error on form creation", err);
            }
        }

        return {onRequest}

    });
