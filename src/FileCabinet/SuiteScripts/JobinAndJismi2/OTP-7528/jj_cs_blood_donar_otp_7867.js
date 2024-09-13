/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
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


        function searchForDonar(bloodGroup,scriptContext) {
            try {
                let bloodDonarSearch = search.create({
                    type: search.Type.CUSTOM_RECORD + '_jj_blood_requirment',
                    title: 'JJ blood donar Search43',
                    id: 'customsearch_jj_blood_donars43',
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
                        {
                            name: 'custrecord_jj_first_name_otp7866',
                            operator: 'is',
                            values: ['Aiswarya']
                        },
                        {
                            name: 'custrecord_jj_last_donation_otp7866',
                            operator: 'is',
                            values: ['Aiswarya']
                        }
                    ]

                });

                // bloodDonarSearch.save();
            

                let cur = scriptContext.currentRecord;
                let i=0;
                bloodDonarSearch.run().each(function (result) {
                    let existingsales = result.getValue({
                        name: 'custrecord_jj_first_name_otp7866'
                    });
                    try {
                        log.debug("Writing")
                        cur.selectLine({
                            sublistId: 'custpage_jj_blood_sublist',
                            line: i
                        });

                        cur.setCurrentSublistValue({
                            sublistId: 'custpage_jj_blood_sublist',
                            fieldId: 'custpage_jj_last_name',
                            value: existingsales,
                            ignoreFieldChange: true
                        });


                        cur.commitLine({
                            sublistId: 'custpage_jj_blood_sublist'
                        });
                        i++;
                    } catch (err) {
                        log.error("Error creating sublist", err)
                    }
                    alert("done");
                    return true;
                });



            }
            catch (err) {
                log.error("Error while searching", err)
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
