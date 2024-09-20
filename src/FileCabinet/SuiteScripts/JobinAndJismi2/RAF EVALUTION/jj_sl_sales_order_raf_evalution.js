/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
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
