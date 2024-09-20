/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 *  * Client Name: Nil
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
define(['N/email', 'N/record', 'N/search','N/format'],
    /**
     * @param{email} email
     * @param{record} record
     * @param{search} search
     */
    function (email, record, search, format) {

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

            if (scriptContext.fieldId == "custpage_jj_email_raf") {
                let emailOfCustomer = scriptContext.currentRecord.getValue({
                    fieldId: "custpage_jj_email_raf"
                });
                let internalIdOfCustomer = toCheckDuplicates(emailOfCustomer, scriptContext.currentRecord);
            }

            if (scriptContext.fieldId == "custpage_jj_item_name") {
                updateSublist(scriptContext)
            }
            if (scriptContext.fieldId == "custpage_jj_quantity") {
                calculateAmount(scriptContext)
            }
        }

        /** 
        * @function calculateAmount
        * @param {object} scriptContext
        * 
        * @throws {Error} Throws an error if there is an issue creating the form or populating its fields.
        * This script will change the amount by multiplyinf rate with quantity
        */
        function calculateAmount(scriptContext)
        {
            try{
                let quantity = scriptContext.currentRecord.getCurrentSublistValue({
                    sublistId: "custpage_jj_so_sublist_raf",
                    fieldId: "custpage_jj_quantity",
                })
                let price = scriptContext.currentRecord.getCurrentSublistValue({
                    sublistId: "custpage_jj_so_sublist_raf",
                    fieldId: "custpage_jj_price",
                })
                scriptContext.currentRecord.setCurrentSublistValue({
                    sublistId: "custpage_jj_so_sublist_raf",
                    fieldId: "custpage_jj_amount",
                    value: quantity * price
                })
            }catch(err)
            {
                log.error(err);
            }
        }
        /** 
        * @function updateSublist
        * @param {object} scriptContext
        * 
        * @throws {Error} Throws an error if there is an issue creating the form or populating its fields.
        * This script will Populate sublist with other values
        */
        function updateSublist(scriptContext)
        {
            try{
                let itemid = scriptContext.currentRecord.getCurrentSublistValue({
                    sublistId: "custpage_jj_so_sublist_raf",
                    fieldId: "custpage_jj_item_name",
                })
                let fieldLookUp = search.lookupFields({
                    type: search.Type.ITEM,
                    id: itemid,
                    columns: ['salesdescription', 'price', 'subsidiary']
                });
                let subsidiaryOfcustomer = scriptContext.currentRecord.getValue({
                    fieldId: "custpage_jj_subsidiary",
                });
                if (subsidiaryOfcustomer != fieldLookUp.subsidiary[0].value) {
                    alert("item Not in the subsidiary");
                    return false
                }
                scriptContext.currentRecord.setCurrentSublistValue({
                    sublistId: "custpage_jj_so_sublist_raf",
                    fieldId: "custpage_jj_item_desc",
                    value: fieldLookUp.salesdescription
                })
                scriptContext.currentRecord.setCurrentSublistValue({
                    sublistId: "custpage_jj_so_sublist_raf",
                    fieldId: "custpage_jj_price",
                    value: fieldLookUp.price
                })
            }catch(err)
            {
                log.error(err);
            }
        }

        /** 
        * @function toCheckDuplicates
        * @param {object} scriptContext
        * @param {string} emailOfCustomer
        * @throws {Error} Throws an error if there is an issue creating the form or populating its fields.
        * This script will Populate sublist with other values
        */

        function toCheckDuplicates(emailOfCustomer, scriptContext) {

            try {


                let customerSearch = search.create({
                    type: "customer",
                    title: 'JJ sales order Search375784',
                    id: 'customsearch_jj_so_search315878',
                    filters:
                        [
                            ["email", "is", emailOfCustomer]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "email", label: "Email" }),
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "subsidiary", label: "subsidiary" })
                        ]
                });
                let internalIdOf, subsidaiaryOfcustomer;
                customerSearch.run().each(function (result) {
                    let exisitig_mail = result.getValue({
                        name: 'email'
                    });


                    internalIdOf = result.getValue({
                        name: 'internalid'
                    });
                    subsidaiaryOfcustomer = result.getValue({
                        name: 'subsidiary'
                    });

                    return true;
                });
                scriptContext.setValue({
                    fieldId: "custpage_jj_subsidiary",
                    value: subsidaiaryOfcustomer
                });
                scriptContext.setValue({
                    fieldId: "custpage_jj_internalid",
                    value: internalIdOf
                });
                return internalIdOf;

            }
            catch (err) {
                log.error("error", err);
            }
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
            let emailOfCustomer = scriptContext.currentRecord.getValue({
                fieldId: "custpage_jj_email_raf"
            });
            if (toCheckDuplicates(emailOfCustomer, scriptContext.currentRecord)) {
                let entityid = toCheckDuplicates(emailOfCustomer, scriptContext.currentRecord)
                creatSalesOrder(entityid, scriptContext.currentRecord);

            }
            else {
                let customerID = createCustomer(scriptContext.currentRecord);
                creatSalesOrder(customerID, scriptContext.currentRecord);
            }

            return true;
        }

        /** 
        * @function  createCustomer
        * @param {object} scriptContext
        * @param {Record} scriptContext.currentRecord - Current form record
        * @returns {integer} recordId of customer
        * @throws {Error} Throws an error if there is an issue creating the form or populating its fields.
        * This script will create a customer
        */

        function createCustomer(currentRecord) {
            try {
                let objRecord = record.create({
                    type: record.Type.CUSTOMER,
                    isDynamic: true,
                });
                let Name = currentRecord.getValue({
                    fieldId: "custpage_jj_first_name_raf"
                });
                let phone = currentRecord.getValue({
                    fieldId: "custpage_jj_phone_raf"
                });
                let email1 = currentRecord.getValue({
                    fieldId: "custpage_jj_email_raf"
                });
                let subsidiary = currentRecord.getValue({
                    fieldId: " custpage_jj_subsidiary"
                });
                objRecord.setValue({
                    fieldId: "companyname",
                    value: Name
                })
                objRecord.setValue({
                    fieldId: "subsidiary",
                    value: 1
                })
                objRecord.setValue({
                    fieldId: "email",
                    value: email1
                })
                objRecord.setValue({
                    fieldId: "phone",
                    value: phone
                })
                let recordId = objRecord.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: false
                });
                return recordId;
            } catch (err) {
                log.error(err)
            }


        }

        /** 
        * @function creatSalesOrder
        * @param {object} scriptContext
        * @param {Record} scriptContext.currentRecord - Current form record
        * @returns {integer} recordId of sales order
        * @throws {Error} Throws an error if there is an issue creating the form or populating its fields.
        * This script will create a sales Order
        */


        function creatSalesOrder(entityid, currentRecord) {
            try{
                let objRecord = record.create({
               
                    type: record.Type.SALES_ORDER,
                    isDynamic: true,
                    defaultValues: {
                        entity: entityid
                    }
                });
                objRecord.setValue(
                  {  fieldId : "orderstatus",
                    value: "B"
                  }
    
                )
                let formRecord = currentRecord;
    
                let lineCount = formRecord.getLineCount('custpage_jj_so_sublist_raf');
                for (let i = 0; i < lineCount; i++) {
                    objRecord.selectLine({
                        sublistId: 'item',
                        line: i
                    });
                    let itemid = currentRecord.getSublistValue({
                        sublistId: "custpage_jj_so_sublist_raf",
                        fieldId: "custpage_jj_item_name",
                        line: i
                    })
                    itemid= format.parse({
                        value: itemid,
                        type: format.Type.SELECT
                    });
                    let obj= objRecord.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: 'item',
                        value: itemid
    
                    });
                    let quantity = currentRecord.getSublistValue({
                        sublistId: "custpage_jj_so_sublist_raf",
                        fieldId: "custpage_jj_quantity",
                        line: i
                    });
                    quantity= format.parse({
                        value: quantity,
                        type: format.Type.FLOAT
                    });
                    objRecord.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: 'quantity',
                        value: quantity
                    });
                    objRecord.commitLine({
                        sublistId: 'item'
                    });
    
                }
                let recordId = objRecord.save(          
                );
    
                try{
                    let fieldLookUp = search.lookupFields({
                        type: search.Type.SALES_ORDER,
                        id: recordId,
                        columns: ['total', 'salesrep']
                    });
        
                    if (fieldLookUp.total > 500) {
                        let fieldLookUp2 = search.lookupFields({
                            type: search.Type.EMPLOYEE,
                            id: fieldLookUp.salesrep[0].value,
                            columns: ['supervisor']
                        });
                        sendMail(fieldLookUp2.supervisor[0].value,recordId)
                    }
                    alert(`Record Created With ID ${recordId}`)
                }catch(err)
                {
                    log.error("Mail Error");
                }
            }catch(err)
            {
                log.error(err)
            }

        }

        /** 
        * @function sendMail
        * @param {integer} recordId of sales order
        * @param {integer} recipientId of supervisor
        * @returns {integer} recordId of sales order
        * @throws {Error} Throws an error if there is an issue creating the form or populating its fields.
        * This script will create a sales Order
        */

        function sendMail(recipientId,recordId) {
            try{
                let senderId = -5;
            let timeStamp = new Date().getUTCMilliseconds();
            recipientId = 12;
            //While adding the render module, the code is showing abnormalities
            // let recPDF = render.transaction({
            //     entityId: recordId,
            //     printMode: render.PrintMode.PDF,
            
            // });
            email.send({
                author: senderId,
                recipients: recipientId,
                subject: 'Test Sample Email Module',
                body: `https://td2932557.app.netsuite.com/app/accounting/transactions/salesord.nl?id=${recordId}  `
                // Record pdf = ${recPDF}
                
            });
            }catch(err)
            {log.error(err)}
        }


        return {
            //pageInit: pageInit,
            fieldChanged: fieldChanged,
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
