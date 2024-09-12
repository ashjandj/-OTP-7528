/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            if (scriptContext.type == "edit")
            {
                addressChecker(scriptContext);
            
            }
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        
        function addressChecker(scriptContext)
        {
            var numOldLines = scriptContext.oldRecord.getLineCount({
                sublistId: 'addressbook'
            });
            var numNewLines = scriptContext.newRecord.getLineCount({
                sublistId: 'addressbook'
            });
            let numberOfLines = Math.max(numNewLines, numOldLines);

            for(let i=0;i<numberOfLines;i++)
            {
                try{
                    let oldSubrecordInvDetail = scriptContext.oldRecord.getSublistSubrecord({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line : i
                    });
                    let newSubrecordInvDetail = scriptContext.newRecord.getSublistSubrecord({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line : i
                    });
                    let newAddress = newSubrecordInvDetail.getValue({
                        fieldId: "addrtext"
                    })
                    let oldAddress = oldSubrecordInvDetail.getValue({
                        fieldId: "addrtext"
                    })
                    if(newAddress != oldAddress)
                    {
                        scriptContext.newRecord.setValue({
                            fieldId: "custentity_jj_address_changed",
                            value: true
                        })
                    }


                }catch(err)
                {
                    scriptContext.newRecord.setValue({
                        fieldId: "custentity_jj_address_changed",
                        value: true
                    })
                }
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
