/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
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
        function calculateAmount(scriptContext)
        {
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
        }
        function updateSublist(scriptContext)
        {
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
            console.log(fieldLookUp.subsidiary)
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
        }


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
                console.log(name + phone + email1 + subsidiary)
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
                console.log(err)
            }


        }
        function creatSalesOrder(entityid, currentRecord) {
            alert(entityid);
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

            var lineCount = formRecord.getLineCount('custpage_jj_so_sublist_raf');
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
                alert(itemid)
                // let itemid = 722
                let obj= objRecord.setCurrentSublistValue({
                    sublistId: "item",
                    fieldId: 'item',
                    value: itemid

                });
                alert(obj)
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
                alert(quantity)
                objRecord.commitLine({
                    sublistId: 'item'
                });
                alert("commited")

            }
            let recordId = objRecord.save(          
            );

            alert(recordId)
            try{
                let fieldLookUp = search.lookupFields({
                    type: search.Type.SALES_ORDER,
                    id: recordId,
                    columns: ['total', 'salesrep']
                });
    
                console.log(fieldLookUp)
                console.log(fieldLookUp.salesrep[0].value)
                if (fieldLookUp.total > 5) {
                    var fieldLookUp2 = search.lookupFields({
                        type: search.Type.EMPLOYEE,
                        id: fieldLookUp.salesrep[0].value,
                        columns: ['supervisor']
                    });
                    console.log("supervisor " + fieldLookUp2.supervisor[0].text)
                    sendMail(fieldLookUp2.supervisor[0].value,recordId)
                }
                alert(`Record Created With ID ${recordId}`)
            }catch(err)
            {
                log.error("Mail Error");
            }

        }

        
        function sendMail(recipientId,recordId) {
            let senderId = -5;
            let timeStamp = new Date().getUTCMilliseconds();
            recipientId = 12;
            //While adding the render module, the code is showing abnormalities
            // var recPDF = render.transaction({
            //     entityId: recordId,
            //     printMode: render.PrintMode.PDF,
            
            // });
            email.send({
                author: senderId,
                recipients: recipientId,
                subject: 'Test Sample Email Module',
                body: `https://td2932557.app.netsuite.com/app/accounting/transactions/salesord.nl?id=${recordId} `
                // Record pdf = ${recPDF}
                
            });
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
