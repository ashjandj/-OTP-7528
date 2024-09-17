/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 ************************************************************************************************************************************
 * Client Name: Nil
 * 
 * Jira Code: OTP-7867
 * 
 * Title: Search through the database to find the matching blood donors
 * 
 * Author: Jobin And Jismi IT Services LLP
 * 
 * Date Created: 2024-09-17
 *
 * Script Description:
 * Create a new form to search for eligible blood donors using filters for blood group and last donation date (at least three months prior).
 *
 * The donor details are stored in the NetSuite database using custom records from the initial blood donor form.
 *
 * The new form should display eligible donors, including details like Name and Phone Number, based on the blood group and last donation date criteria.
 * 
 * 
 * Revision History: 1.0
 *************************************************************************************************************************************8

 */
define(['N/format', 'N/record', 'N/search'],
    /**
     * @param{format} format
     * @param{record} record
     * @param{search} search
     */
    function (format, record, search) {

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
            if (scriptContext.fieldId == "custpage_jj_blood_group_otp7866") {
                try {
                    let selectedBloodGroup = scriptContext.currentRecord.getValue({
                        fieldId: scriptContext.fieldId
                    });
                    removeSublistLine(scriptContext.currentRecord);
                    searchForDonar(selectedBloodGroup, scriptContext);
                } catch (err) {
                    log.error("Error fetching data", err);
                }
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

        }

        /**
            * Searches for eligible blood donors based on the provided blood group and last donation date.
            * Populates the sublist on the form with matching donor details (First Name, Last Name, Phone Number).
            *
            * @param {number} bloodGroup - The selected blood group value from the form.
            * @param {Object} scriptContext - The context object containing the current record being processed.
            * @param {Record} scriptContext.currentRecord - The current record instance where the donor details will be populated.
            *
            * @throws {Error} Logs an error if the search or sublist population fails.
        */

        function searchForDonar(bloodGroup, scriptContext) {
            try {
                let bloodDonarSearch = search.create({
                    type: search.Type.CUSTOM_RECORD + '_jj_blood_requirment',
                    title: 'JJ blood donar Search37',
                    id: 'customsearch_jj_blood_donars37',
                    columns: [{
                        name: 'custrecord_jj_first_name_otp7866'
                    },
                    {
                        name: 'custrecord_jj_last_name_otp7866'
                    },
                    {
                        name: 'custrecord_jj_phone_otp7866'
                    }
                    ]
                    , filters: [
                        ["custrecord_jj_blood_group_otp7866", "anyof", bloodGroup],
                        "AND",
                        ["formulanumeric: {today}-{custrecord_jj_last_donation_otp7866}", "greaterthan", "30"]
                    ]

                });

                let formRecord = scriptContext.currentRecord;
                let i = 0;
                bloodDonarSearch.run().each(function (result) {
                    let firstName = result.getValue({
                        name: 'custrecord_jj_first_name_otp7866'
                    });
                    let lastName = result.getValue({
                        name: 'custrecord_jj_last_name_otp7866'
                    });
                    let phoneNumber = result.getValue({
                        name: 'custrecord_jj_phone_otp7866'
                    });
                    formRecord.selectLine({
                        sublistId: 'custpage_jj_blood_sublist',
                        line: i
                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_blood_sublist',
                        fieldId: 'custpage_jj_first_name',
                        value: firstName,

                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_blood_sublist',
                        fieldId: 'custpage_jj_last_name',
                        value: lastName,

                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_blood_sublist',
                        fieldId: 'custpage_jj_phone_number',
                        value: phoneNumber,

                    });
                    formRecord.commitLine({
                        sublistId: 'custpage_jj_blood_sublist'
                    });
                    i++;
                    return true;
                });
            }
            catch (err) {
                log.error("Error while searching", err)
            }
        }

        /**
            * Removes all lines from the 'Blood Donar Details' sublist on the provided form record.
            *
            * Iterates through the sublist and removes each line one by one.
            *
            * @param {Record} formRecord - The current form record from which the sublist lines will be removed.
            *
            * @throws {Error} Logs an error if there is an issue during the line removal process.
        */
        function removeSublistLine(formRecord) {
            try {
                var lineCount = formRecord.getLineCount('custpage_jj_blood_sublist');
                for (let i = 0; i < lineCount; i++) {


                    formRecord.removeLine({
                        sublistId: 'custpage_jj_blood_sublist',
                        line: 0
                    });

                }
            } catch (err) {
                log.error("Error deleting sublistline", err)
            }
        }
        return {
            // pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };

    });
