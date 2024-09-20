/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *************************************************************************************************************************************
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
define(['N/ui/serverWidget'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = createBloodDonarCheckForm();
                try {
                    scriptContext.response.writePage(form);
                } catch (err) {
                    log.error("Error creating Form", err);
                    scriptContext.response.write(`<h1 style= "color:red">Something went wrong</h1>`);
                }
            }
            else if (scriptContext.request.method === 'POST') {
                let recordId = createBloodDonarRecord(scriptContext.request.parameters);
                scriptContext.response.write(`<h3 style= "color:red">Record has been created with the id : ${recordId}
                    </h3>`);
            }


        }
        /**
            * Creates a NetSuite form for finding blood donors based on their blood group.
            *
            * The form contains a dropdown to select a blood group and a sublist to display donor details, 
            * such as First Name, Last Name, and Phone Number. It also links to a client script for additional functionality.
            *
            * @returns {serverWidget.Form} The NetSuite form object with blood donor search functionality.
            * @throws {Error} Logs an error if the form creation fails.
        */
        function createBloodDonarCheckForm() {
            try {
                let form = serverWidget.createForm({
                    title: 'Find Blood Donar'
                });

                let bloodGroup = form.addField({
                    id: 'custpage_jj_blood_group_otp7866',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Blood Group'
                });
                bloodGroup.addSelectOption({
                    text: "",
                    value: 0
                });
                bloodGroup.addSelectOption({
                    text: "A+",
                    value: 1
                });
                bloodGroup.addSelectOption({
                    text: "A-",
                    value: 2
                });
                bloodGroup.addSelectOption({
                    text: "B+",
                    value: 3
                });
                bloodGroup.addSelectOption({
                    text: "B-",
                    value: 4
                });
                bloodGroup.addSelectOption({
                    text: "AB+",
                    value: 5
                });
                bloodGroup.addSelectOption({
                    text: "AB-",
                    value: 6
                });
                bloodGroup.addSelectOption({
                    text: "O+",
                    value: 7
                });
                bloodGroup.addSelectOption({
                    text: "O-",
                    value: 8
                });
                let bloodDonarsublist = form.addSublist({
                    id: 'custpage_jj_blood_sublist',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'Blood Donar Details'
                });
                bloodDonarsublist.addField({
                    id: 'custpage_jj_first_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                });
                bloodDonarsublist.addField({
                    id: 'custpage_jj_last_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });
                bloodDonarsublist.addField({
                    id: 'custpage_jj_phone_number',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });
                form.clientScriptModulePath = "SuiteScripts/JobinAndJismi2/OTP-7528/jj_cs_blood_donar_otp_7867.js"
                return form;
            } catch (err) {
                log.error("Error on form creation", err);
            }
        }

        return { onRequest }

    });
