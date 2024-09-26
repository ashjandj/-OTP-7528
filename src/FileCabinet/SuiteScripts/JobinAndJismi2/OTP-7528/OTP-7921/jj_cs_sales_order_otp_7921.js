/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 *  ************************************************************************************************************************************
 * Client Name: Nil
 * 
 * Jira Code: OTP-7921
 * 
 * Title: Custom page for display sales order based on the status
 * 
 * Author: Jobin And Jismi IT Services LLP
 * 
 * Date Created: Sep 20, 2024
 *
 * Script Description:
 * The script creates a custom form to display sales orders that need fulfillment or billing, featuring essential columns like Internal IDs, Document Number, and Total.

 * Users can filter the orders by Status, Customer, Subsidiary, and Department, with values updating dynamically based on selections.
 *
 * The interface is designed for user-friendliness, enabling quick navigation and efficient access to relevant sales order data.
 * 
 * 
 * Revision History: 1.0
 *************************************************************************************************************************************8

 */
define(['N/record', 'N/search', 'N/format'],

    /**
     * @param{record} record
     * @param{search} search
     */
    function (record, search, format) {

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
            let fieldsInForm = ["custpage_jj_subsidiary_7921", 'custpage_jj_department_7921', 'custpage_jj_customer_7921', 'custpage_jj_so_7921'];
            if (fieldsInForm.includes(scriptContext.fieldId)) {
                removeSublistLine(scriptContext.currentRecord);
                updateSublist(scriptContext);
            }
        }

        
        /**
            * Updates the sales order sublist on the form based on selected filters.
            *
            * @function updateSublist
            * @param {Object} scriptContext - The context object containing information about the script's execution environment.
            * @param {Object} scriptContext.currentRecord - The current record being processed, which includes the form data.
            * @returns {void} 
            * @throws {Error} Throws an error if there is an issue during the search or updating of the sublist.
            *
            * This function performs the following actions:
            * - Creates dynamic filters based on selected subsidiary, department, customer, and status.
            * - Executes a search for sales orders that match the applied filters.
            * - Populates the sublist with relevant sales order details, including Internal ID, Document Name, Date, Status, Customer Name,
            *   Subsidiary, Department, Class, Subtotal, Tax, and Total.
            * - Handles exceptions for missing or invalid data gracefully, ensuring the sublist updates correctly.
        */
        function updateSublist(scriptContext) {
            try {
                let subTotalArrayResult = createsubTotalArrayResult();
                let filter = [
                    {
                        name: 'status',
                        operator: 'is',
                        values: ["SalesOrd:A", "SalesOrd:B", "SalesOrd:D", "SalesOrd:E", "SalesOrd:F",]
                    }, {
                        name: 'mainline',
                        operator: 'is',
                        values: ['T']
                    }
                ];
                let currentForm = scriptContext.currentRecord;
                let subsidiary = currentForm.getValue({
                    fieldId: "custpage_jj_subsidiary_7921"
                })
                if (subsidiary) {
                    let filterNew = {
                        name: 'subsidiary',
                        operator: 'is',
                        values: [subsidiary]
                    }
                    filter.push(filterNew);
                }
                let department = currentForm.getValue({
                    fieldId: "custpage_jj_department_7921"
                })
                if (department) {
                    let filterNew = {
                        name: 'department',
                        operator: 'is',
                        values: [department]
                    }
                    filter.push(filterNew);

                }
                let customer = currentForm.getValue({
                    fieldId: "custpage_jj_customer_7921"
                })
                if (customer) {
                    let filterNew = {
                        name: 'entity',
                        operator: 'is',
                        values: [customer]
                    }
                    filter.push(filterNew);
                }
                let status = currentForm.getValue({
                    fieldId: "custpage_jj_so_7921"
                })
                if (status) {

                    let filterNew = {
                        name: 'status',
                        operator: 'is',
                        values: [status]
                    }
                    filter.shift();
                    filter.unshift(filterNew);
                }
                let salesOrderSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    title: 'JJ sales order Search35',
                    id: 'customsearch_jj_so_search35',
                    columns: [{
                        name: 'internalid'
                    },
                    {
                        name: 'trandate'
                    },
                    {
                        name: 'tranid'
                    },
                    {
                        name: 'status'
                    },
                    {
                        name: 'entity'
                    },
                    {
                        name: 'subsidiary'
                    },
                    {
                        name: 'department'
                    },
                    {
                        name: 'class'
                    },
                    {
                        name: 'taxtotal'
                    },
                    {
                        name: 'total'
                    },
                    ],
                    filters: filter
                });
                let i = 0;

                let formRecord = scriptContext.currentRecord;

                let departmentOfSO = "", classOfSO = "";
                salesOrderSearch.run().each(function (result) {
                    let internalid = result.getValue({
                        name: 'internalid'
                    });
                    let dateOfSO = result.getValue({
                        name: 'trandate'
                    });
                    let documentName = result.getValue({
                        name: 'tranid'
                    });
                    dateOfSO = format.parse({ value: dateOfSO, type: format.Type.DATE });
                    let statusOfSO = result.getValue({
                        name: 'status'
                    });
                    let nameOfSOText = result.getText({
                        name: 'entity'
                    });
                    try {
                        departmentOfSO = result.getText({
                            name: 'department'
                        });
                    } catch (err) {
                        departmentOfSO = " "
                    }
                    try {
                        let taxtotalOfSO = result.getValue({
                            name: 'taxtotal'
                        });
                        if(!taxtotalOfSO)
                        {
                            taxtotalOfSO = 0.0;
                        }
                    } catch (err) {
                        taxtotalOfSO = "0.0"
                    }
                    try {
                        classOfSO = result.getText({
                            name: 'class'
                        });

                    } catch (err) {
                        classOfSO = " "
                    }
                    let subsidiaryOfSO = result.getText({
                        name: 'subsidiary'
                    });
                    let totalOfSO = result.getValue({
                        name: 'total'
                    });
                    formRecord.selectLine({
                        sublistId: 'custpage_jj_so_sublist',
                        line: i
                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_id',
                        value: internalid
                    });

                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_document_name',
                        value: documentName
                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_date',
                        value: dateOfSO
                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_status',
                        value: statusOfSO
                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_customer_name',
                        value: nameOfSOText
                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_subsidiary',
                        value: subsidiaryOfSO
                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_department',
                        value: departmentOfSO
                    });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_class',
                        value: classOfSO
                    });
                    let entry = subTotalArrayResult.find(item => item.internalId === internalid);

                    entry = format.parse({ value: entry, type: format.Type.CURRENCY });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_subtotal',
                        value: entry.grossAmount
                    });

                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_tax',
                        value: taxtotalOfSO
                    });
                    totalOfSO = format.parse({ value: totalOfSO, type: format.Type.CURRENCY });
                    formRecord.setCurrentSublistValue({
                        sublistId: 'custpage_jj_so_sublist',
                        fieldId: 'custpage_jj_total',
                        value: totalOfSO
                    });

                    formRecord.commitLine({
                        sublistId: 'custpage_jj_so_sublist'
                    });
                    i++;
                    return true;
                });

            }
            catch (err) {

                log.error("Error Updating the sublist", err);
            }
        }
        /**
            * Creates an array of subtotal amounts for sales orders based on specific filters.
            *
            * @function createsubTotalArrayResult
            * @returns {Array<Object>} An array of objects, each containing the internal ID and gross amount of sales orders.
            * @throws {Error} Throws an error if there is an issue during the search execution.
            *
            * This function performs the following actions:
            * - Executes a search for sales orders with an income account type and specific statuses (Pending Approval, Pending Fulfillment,
            *   Partially Fulfilled, etc.).
            * - Aggregates the results by internal ID and gross amount.
            * - Returns an array where each object contains the internal ID and the total gross amount for the corresponding sales order.
        */
        function createsubTotalArrayResult() {
            let subtotalorderSearchObj = search.create({
                type: search.Type.SALES_ORDER,
                title: 'JJ sales order Search31',
                id: 'customsearch_jj_so_search31',
                filters:
                    [
                        ["account.type", "anyof", "Income"], "AND",
                        [
                            'status',
                            'is',
                            ["SalesOrd:A", "SalesOrd:B", "SalesOrd:D", "SalesOrd:E", "SalesOrd:F"]
                        ]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "grossamount",
                            summary: "SUM",
                            label: "Amount (Gross)"
                        })
                    ]
            });


            let subTotalArrayResult = [];
            subtotalorderSearchObj.run().each(function (result) {
                let internalId = result.getValue({
                    name: "internalid",
                    summary: "GROUP"
                });

                let grossAmount = result.getValue({
                    name: "grossamount",
                    summary: "SUM"
                });

                subTotalArrayResult.push({ internalId: internalId, grossAmount: grossAmount })
                return true;
            });
            return subTotalArrayResult;
        }


        /**
            * Removes all lines from a specified sublist on the form.
            *
            * @function removeSublistLine
            * @param {Object} formRecord - The current record object representing the form.
            * @returns {void}
            * @throws {Error} Throws an error if there is an issue during the line removal process.
            *
            * This function performs the following actions:
            * - Retrieves the line count of the specified sublist.
            * - Iteratively removes each line from the sublist by consistently targeting the first line until all lines are deleted.
        */
        function removeSublistLine(formRecord) {
            try {
                var lineCount = formRecord.getLineCount('custpage_jj_so_sublist');
                for (let i = 0; i < lineCount; i++) {


                    formRecord.removeLine({
                        sublistId: 'custpage_jj_so_sublist',
                        line: 0
                    });

                }
            } catch (err) {
                log.error("Error deleting sublistline", err)
            }
        }

        return {
            fieldChanged: fieldChanged
           
        };

    });
