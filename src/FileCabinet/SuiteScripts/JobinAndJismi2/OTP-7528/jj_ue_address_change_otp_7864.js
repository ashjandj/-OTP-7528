/**
 * @NApiVersion 2.1
 * @NScriptType User Event Script 
 * 
 * Client Name: Nil
 * 
 * Jira Code: OTP-7864
 * 
 * Title: Identify change in Address
 * 
 * Author: Jobin And Jismi IT Services LLP
 * 
 * Date Created: 2024-09-12
 *
 * Script Description:
 * Script Description: This script checks for changes or additions in the addressbook sublist 
 * of the Customer Record and sets a custom checkbox field to true if any modifications are detected.
 * 
 * Revision History: Nil
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
            if (scriptContext.type == "edit") {
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


        /**
            * Checks if any address in the addressbook sublist has been added or modified, 
            * and sets a custom field "custentity_jj_address_changed" to true if a change is detected.
            *
            * @param {Object} scriptContext - The context object provided by the User Event Script.
            * @param {Record} scriptContext.oldRecord - The old version of the record being processed.
            * @param {Record} scriptContext.newRecord - The new version of the record being processed.
            * @param {Function} scriptContext.oldRecord.getLineCount - Retrieves the number of lines in the sublist for the old record.
            * @param {Function} scriptContext.newRecord.getLineCount - Retrieves the number of lines in the sublist for the new record.
            * @param {Function} scriptContext.oldRecord.getSublistSubrecord - Gets the subrecord for the old address in the addressbook sublist.
            * @param {Function} scriptContext.newRecord.getSublistSubrecord - Gets the subrecord for the new address in the addressbook sublist.
            * @param {Function} scriptContext.newRecord.setValue - Sets a value on the new record.
            * 
            * @throws {Error} If an issue occurs while accessing or comparing the address subrecords.
        */

        function addressChecker(scriptContext) {
            var numOldLines = scriptContext.oldRecord.getLineCount({
                sublistId: 'addressbook'
            });
            var numNewLines = scriptContext.newRecord.getLineCount({
                sublistId: 'addressbook'
            });
            let numberOfLines = Math.max(numNewLines, numOldLines);

            for (let i = 0; i < numberOfLines; i++) {
                try {
                    let oldSubrecordInvDetail = scriptContext.oldRecord.getSublistSubrecord({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line: i
                    });
                    let newSubrecordInvDetail = scriptContext.newRecord.getSublistSubrecord({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line: i
                    });
                    let newAddress = newSubrecordInvDetail.getValue({
                        fieldId: "addrtext"
                    })
                    let oldAddress = oldSubrecordInvDetail.getValue({
                        fieldId: "addrtext"
                    })
                    if (newAddress != oldAddress) {
                        scriptContext.newRecord.setValue({
                            fieldId: "custentity_jj_address_changed",
                            value: true
                        })
                    }


                } catch (err) {
                    scriptContext.newRecord.setValue({
                        fieldId: "custentity_jj_address_changed",
                        value: true
                    })
                }
            }
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
