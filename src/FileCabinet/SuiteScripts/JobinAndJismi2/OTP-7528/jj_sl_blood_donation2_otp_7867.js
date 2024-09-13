/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
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
        function createBloodDonarCheckForm()
        {
            try{
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
                var bloodDonarsublist = form.addSublist({
                    id : 'custpage_jj_blood_sublist',
                    type : serverWidget.SublistType.INLINEEDITOR,
                    label : 'Blood Donar Details'
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
            }catch(err)
            {
                log.error("Error on form creation",err);               
            }
        }

        return {onRequest}

    });
