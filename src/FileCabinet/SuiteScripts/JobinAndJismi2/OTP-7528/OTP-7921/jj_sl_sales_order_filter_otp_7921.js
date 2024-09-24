/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *************************************************************************************************************************************
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
 *
 */
define(['N/ui/serverWidget', 'N/search'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget, search) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = salesOrderFilterForm();
                try {
                    scriptContext.response.writePage(form);
                } catch (err) {
                    log.error("Error creating Form", err);
                    scriptContext.response.write(`<h1 style= "color:red">Something went wrong</h1>`);
                }
            }

        }

        /**
        * Creates a custom sales order filter form with dynamically populated select fields and a sublist.
        *
        * @function salesOrderFilterForm
        * @returns {Object} The created form object containing select fields for subsidiaries, departments, customers, and status,
        *                   along with a sublist displaying relevant sales order details.
        * @throws {Error} Throws an error if there is an issue creating the form or populating its fields.
        *
        * The form includes:
        * - Select fields for Subsidiary, Department, Customer, and Status.
        * - A sublist that displays sales order details including Internal ID, Document Name, Date, Status, Customer Name, 
        *   Subsidiary, Department, Class, Subtotal, Tax, and Total.
        * - Client script module path for additional functionality.
        */

        function salesOrderFilterForm() {
            try {
                let form = serverWidget.createForm({
                    title: 'Sales Order Filter'
                });
                //Populating the subsidiary list
                let subsidiary = form.addField({
                    id: 'custpage_jj_subsidiary_7921',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Subsidiary'
                });
                subsidiary.addSelectOption({
                    value: "",
                    text: ""
                });
                let subsidiarySearch = search.create({
                    type: search.Type.SUBSIDIARY,
                    title: 'JJ subsidiary Search',
                    id: 'customsearch_jj_subsidiary',
                    columns: [{
                        name: 'internalid'
                    },
                    {
                        name: 'name'
                    }
                    ]

                });
                subsidiarySearch.run().each(function (result) {
                    let subsidiaryText = result.getValue({
                        name: 'name'
                    });
                    let subsidiaryId = result.getValue({
                        name: 'internalid'
                    });
                    subsidiary.addSelectOption({
                        value: subsidiaryId,
                        text: subsidiaryText
                    });
                    return true;
                });

                //Populating the department list

                let department = form.addField({
                    id: 'custpage_jj_department_7921',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Department'
                });
                department.addSelectOption({
                    value: "",
                    text: ""
                });

                let departmentSearch = search.create({
                    type: search.Type.DEPARTMENT,
                    title: 'JJ department Search',
                    id: 'customsearch_jj_department',
                    columns: [{
                        name: 'internalid'
                    },
                    {
                        name: 'name'
                    }
                    ]

                });
                departmentSearch.run().each(function (result) {
                    let departmentText = result.getValue({
                        name: 'name'
                    });
                    let departmentId = result.getValue({
                        name: 'internalid'
                    });
                    department.addSelectOption({
                        value: departmentId,
                        text: departmentText
                    });
                    return true;
                });
                //Populating the customer list

                let customer = form.addField({
                    id: 'custpage_jj_customer_7921',
                    type: serverWidget.FieldType.SELECT,
                    label: 'customer'
                });
                customer.addSelectOption({
                    value: "",
                    text: ""
                });

                let customerSearch = search.create({
                    type: search.Type.CUSTOMER,
                    title: 'JJ customer Search',
                    id: 'customsearch_jj_customer',
                    columns: [{
                        name: 'internalid'
                    },
                    {
                        name: 'companyname'
                    }
                    ]

                });
                customerSearch.run().each(function (result) {
                    let customerText = result.getValue({
                        name: 'companyname'
                    });
                    let customerId = result.getValue({
                        name: 'internalid'
                    });
                    customer.addSelectOption({
                        value: customerId,
                        text: customerText
                    });
                    return true;
                });

                //Populating the status list

                let statusOfSo = form.addField({
                    id: 'custpage_jj_so_7921',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Status'
                });
                statusOfSo.addSelectOption({
                    value: "",
                    text: ""
                });
                statusOfSo.addSelectOption({
                    value: "SalesOrd:A",
                    text: "Sales Order:Pending Approval"
                });
                statusOfSo.addSelectOption({
                    value: "SalesOrd:B",
                    text: "Sales Order:Pending Fulfillment"
                });
                statusOfSo.addSelectOption({
                    value: "SalesOrd:D",
                    text: "Sales Order:Partially Fulfilled"
                });
                statusOfSo.addSelectOption({
                    value: "SalesOrd:E",
                    text: "Sales Order:Pending Billing/Partially Fulfilled"
                });
                statusOfSo.addSelectOption({
                    value: "SalesOrd:F",
                    text: "Sales Order:Pending Billing"
                });

                let salesOrderList = form.addSublist({
                    id: 'custpage_jj_so_sublist',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'Sales Orders'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_id',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Internal Id'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_document_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Document Name'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Date'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_status',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Status'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_customer_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_subsidiary',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subsidiary'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_department',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Department'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_class',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Class'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_subtotal',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Sub Total'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_tax',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Tax'
                });
                salesOrderList.addField({
                    id: 'custpage_jj_total',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Total'
                });
                form.clientScriptModulePath = "SuiteScripts/JobinAndJismi2/OTP-7528/jj_cs_sales_order_otp_7921.js"
                return form;
            }
            catch (err) {
                log.error("Error in the function salesOrderFilterForm", err);
            }
        }

        return { onRequest }

    });
