window.onload = function(){
    checkLogin();
}
//To check whether user is logged in or not
function checkLogin(){
    $.ajax({
        url: "checkLogin.php",
        type: "POST",
        success: function(response){
            if(response == true){
                //To close the login form
                document.getElementById("loginForm").style.display = "none";
            }
        }
    });
}

let loading=`
<div class="loading">
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
</div>   
`;
//Code to load the tables from the database as soon as the page loads
function loadTables(){
    //To create a loading div inside the tables div
    document.getElementById("tables").innerHTML = loading;
    $.ajax({
        url: "getTables.php",
        type: "POST",
        success: function(response){
            //Clear the loading div
            document.getElementById("tables").innerHTML = "";
            //For each table returned, create a button and append it to the div
            let data = JSON.parse(response);
            for(var i = 0; i < data.length; i++){
                var button = document.createElement("button");
                button.innerHTML = data[i];
                button.setAttribute("onclick", "loadForm(this.innerHTML)");
                button.setAttribute("id", data[i]);
                document.getElementById("tables").appendChild(button);
            }
        }
    });
}
function loadForm(table){
    //To create a loading div inside the data div
    document.getElementById("data").innerHTML = loading;
    $.ajax({
        url: "getTableData.php",
        type: "POST",
        data: {table: table},
        success: function(response){
            //Clear the loading div
            document.getElementById("data").innerHTML = "";
            //Append the form to the data div
    
            let data = JSON.parse(response);
            //To dynamically create the form
            let formLabel = document.createElement("h2");
            formLabel.innerHTML = data.table;
            document.getElementById("data").appendChild(formLabel);
            //Create a button to toggle the table as visible or invisible
            let toggle = document.createElement("button");
            toggle.setAttribute("id", "toggleTable");
            toggle.setAttribute("onclick", "toggleTable()");
            toggle.innerHTML = "Show/Close Table";
            
    
            let form = document.createElement("form");
            form.setAttribute("id", "myForm");
            form.setAttribute("method", "POST");
            //To create the input fields
            var fields = data.fields;
            for(var i = 0; i < fields.length; i++){
                let label = document.createElement("label");
                label.setAttribute("for", fields[i]);
                label.innerHTML = fields[i];
                let input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("name", fields[i]);
                input.setAttribute("id", fields[i]);
                form.appendChild(label);
                form.appendChild(input);
            }
            //To create the submit button which will submit via a custom function
            let submit = document.createElement("input");
            submit.setAttribute("type", "button");
            submit.setAttribute("value", "Enter Record");
            submit.setAttribute("onclick", "submitForm()");
            form.appendChild(submit);
            document.getElementById("data").appendChild(form);
            document.getElementById("data").appendChild(toggle);
             // Process the JSON data and generate the table body
            var rows = data.data;
            var table = "<table id='my-table'>";
            // Generate the table header
            table += '<thead><tr>';
            for (var i = 0; i < fields.length; i++) {
                table += '<th>' + fields[i] + '</th>';
            }
            table += '</tr></thead>';
            // Generate the table body
            table += '<tbody>';
            for (var i = 0; i < rows.length; i++) {
                table += `<tr ondblclick="optionMenu(event)" value="${i}">`;
                for (var j = 0; j < rows[i].length; j++) {
                table += '<td>' + rows[i][j] + '</td>';
                }
                table += '</tr>';
            }
            table += '</tbody>';
            table += '</table>';
            // Add the table to the HTML document
            document.getElementById('data').innerHTML += table;
        }
    });
}

function loadReports()
{
//To get all the views from the database
    //To create a loading div inside the data div
    document.getElementById("reports").innerHTML = loading;
    //To get the views from the database
    $.ajax({
        url: "getViews.php",
        type: "POST",
        success: function(response){
            //Clear the loading div
            document.getElementById("reports").innerHTML = "";
        //put the views as buttons in the reports div
            
            let data = JSON.parse(response);
            for(var i = 0; i < data.length; i++){
                var button = document.createElement("button");
                button.innerHTML = data[i];
                button.setAttribute("onclick", "loadReport(this.innerHTML)");
                 button.setAttribute("id", data[i]);
                document.getElementById("reports").appendChild(button);
            }
        }
    });

}
//Function to load the report
function loadReport(view){
    //To create a loading div inside the data div
    document.getElementById("data").innerHTML = loading;
    $.ajax({
        url: "getViewData.php",
        type: "POST",
        data: {viewName: view},
        success: function(response){
            console.log(response);
            //Clear the loading div
            document.getElementById("data").innerHTML = "";
            //JSON.parse the response
            let data = JSON.parse(response);
            //To dynamically create the report from the view data
            let formLabel = document.createElement("h2");
            formLabel.innerHTML = view+" Report";
            document.getElementById("data").appendChild(formLabel);
            //
            // Assuming that the PHP script returns a JSON object
            // containing the fields, data, and probableFields
            var fields = data.fields;
            var viewData = data.data;
            var probableFields = data.probableFields;
        
            // Find the HTML element where the report should be displayed
            let dataDiv = document.getElementById('data');
            //Create a div to hold the report
            let reportDiv = document.createElement("div");
            reportDiv.setAttribute("id", "report-container");
            dataDiv.appendChild(reportDiv);
            var reportContainer = reportDiv;
            // Create a new HTML table element
            var table = document.createElement('table');
            table.className = 'report-table';
            // Create the table header row
            var headerRow = document.createElement('tr');
            for (var i = 0; i < fields.length; i++) {
            var headerCell = document.createElement('th');
            headerCell.innerText = fields[i].name;
            headerRow.appendChild(headerCell);
            }
            table.appendChild(headerRow);
            // Create the table data rows
            var totalRow = document.createElement('tr');
            var totalCounts = {}; // Object to store total counts for each probableField
            for (var i = 0; i < viewData.length; i++) {
            var dataRow = document.createElement('tr');
            for (var j = 0; j < fields.length; j++) {
                var dataCell = document.createElement('td');
                dataCell.innerText = viewData[i][fields[j].name];
                dataRow.appendChild(dataCell);
                // Check if the current field is a probableField
                if (probableFields.includes(fields[j].name)) {
                var value = viewData[i][fields[j].name];
                if (!isNaN(parseFloat(value))) {
                    // Add the value to the corresponding total count
                    if (totalCounts.hasOwnProperty(fields[j].name)) {
                        totalCounts[fields[j].name].count++;
                        totalCounts[fields[j].name].total += parseFloat(value);
                    } else {
                        totalCounts[fields[j].name] = {count: 1, total: parseFloat(value)};
                    }
                    // Round off the value to 2 decimal places if it is not the first field in the table
                    if (j > 0) {
                        dataCell.innerText = parseFloat(value).toFixed(2);
                    } else {
                        dataCell.innerText = value;
                    }
                }
                }
            }
            table.appendChild(dataRow);
            }
            // Create the total row for probableFields
            for (var i = 0; i < fields.length; i++) {
            var fieldName = fields[i].name;
            if (probableFields.includes(fieldName)) {
                var totalCell = document.createElement('td');
                totalCell.innerText = 'Total: ' + totalCounts[fieldName].total.toFixed(2) + ', Average: ' + (totalCounts[fieldName].total / totalCounts[fieldName].count).toFixed(2);
                totalRow.appendChild(totalCell);
            } else {
                totalRow.appendChild(document.createElement('td'));
            }
            }
            table.appendChild(totalRow);
        
            // Add the table to the report container
            reportContainer.appendChild(table);
                    //
                }
            });
}

function toggleTable(){
    var table = document.getElementById("my-table");
    if(table.style.display == "none"){
        table.style.display = "block";
    }
    else{
        table.style.display = "none";
    }
}

function submitForm()
{
    //To get the table name
    var table = document.getElementById("myForm").parentNode.firstChild.innerHTML;
    //To get the form data
    var formData = $("#myForm").serializeArray();
    //To get the form data in JSON format
    var data = {};
    for(var i = 0; i < formData.length; i++){
        data[formData[i].name] = formData[i].value;
    }
    //To send the data to the server
    $.ajax({
        url: "enterRecords.php",
        type: "POST",
        data: {table: table, data: data},
        success: function(response){
            if(response==true)
            {
                alert("Record entered successfully");
                loadForm(table);
            }
            else
            {
                alert("Error entering record");
            }
        }
    });
}
var itemStack=[];
// Create context menu
function optionMenu(e) {
  // Prevent default context menu
  //To log out the details of the row clicked
  let clickedIndex=(e.target.parentNode.rowIndex);
  let clickedRow=document.getElementById("my-table").rows[clickedIndex].cells;
   itemStack.push(clickedRow);
  //To get the table name
    var table = document.getElementById("myForm").parentNode.firstChild.innerHTML;
    //To get the clicked row's data
  // Remove existing context menu if present
  var existingMenu = document.querySelector(".context-menu");
  if (existingMenu) {
    existingMenu.remove();
  }
  // Create new context menu
  var menu = document.createElement("div");
  menu.classList.add("context-menu");
  menu.innerHTML = `
    <div class="context-menu-item" onclick="editRecord()">Edit</div>
    <div class="context-menu-item" onclick="deleteRecord()">Delete</div>
  `;

  // Style the context menu
  menu.style.position = "fixed";
  menu.style.top = "50%";
  menu.style.left = "50%";
  menu.style.transform = "translate(-50%, -50%)";
  menu.style.padding = "10px";
  menu.style.background = "#fff";
  menu.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  menu.style.borderRadius = "5px";
  menu.style.zIndex = "9999";
  menu.style.cursor = "pointer";
  // Append the context menu to the body
  document.body.appendChild(menu);
}


// Example edit and delete functions
function editRecord() {
    let clickedRow=itemStack[itemStack.length-1];
   //To put the data into the form
    let data=[];
    //Put the row's data into an array formatted to match form data
    for(var i=0;i<clickedRow.length;i++)
    {
        data.push(clickedRow[i].innerHTML);
    }
    let form=document.getElementById("myForm");
    let formData=form.elements;
    for(var i=0;i<formData.length;i++)
    {
        formData[i].value=data[i];
    }
    //To change the submit button to an update button
    let submit=document.getElementById("myForm").lastChild;
    submit.setAttribute("value","Update Record");
    submit.setAttribute("onclick","updateRecord()");
    //To clear the stack
    itemStack=[];
    //To delete the context menu
    let menu=document.querySelector(".context-menu");
    menu.remove();
}

function deleteRecord() {
    let form=document.getElementById("myForm");
    let formData=form.elements;
    //To get the primary key from the form
    let primary_key=formData[0].id;
    let clickedRow=itemStack[itemStack.length-1];
    //To get the table name
    var table = document.getElementById("myForm").parentNode.firstChild.innerHTML;
    //To get the primary key value
    let primary_key_value=clickedRow[0].innerHTML;
    //To send the data to the server
    $.ajax({
        url: "deleteRecord.php",
        type: "POST",
        data: {table: table,primary_key_value:primary_key_value,primary_key:primary_key},
        success: function(response){
            if(response==true)
            {
                alert("Record deleted successfully");
                //To click the table button to refresh the table
                document.getElementById(`${table}`).click();
               //To toggle the table
               setTimeout(toggleTable,2000);
            }
            else
            {
                alert("Record could not be deleted");
                console.log(response);
            }
        }
    });
    //To clear the stack
    itemStack=[];
    //To delete the context menu
    let menu=document.querySelector(".context-menu");
    menu.remove();
}

function updateRecord()
{
    //To get the table name
    var table = document.getElementById("myForm").parentNode.firstChild.innerHTML;
    //To get the form data
    var formData = $("#myForm").serializeArray();
    //To get the form data in JSON format
    var data =[];
    for(var i = 0; i < formData.length; i++){
         data.push(formData[i].value);
    }
    //To send the data to the server
    $.ajax({
        url: "updateRecords.php",
        type: "POST",
        data: {table: table, data: data,primary_key_value:data[0]},
        success: function(response){
           if(response==true)
           {
               alert("Record updated successfully");
               //To click the table button to refresh the table
                document.getElementById(`${table}`).click();
                //To click the toggle button to hide the table
                document.getElementById("toggle").click();
                document.getElementById("toggle").click();
           }
           else
           {
               alert("Record could not be updated");
               console.log(response);
           }
        }
    });
}

//Login function
function login(){
    $.post("login.php",{
        databasename: $("#databasename").val(),
        servicename: $("#serviceName").val(),
        username: $("#username").val(),
        password: $("#password").val()
    },function(data){
        //if the login is successful, the login form will be hidden and the menu will be shown
        if(data == true){
            $("#loginForm").hide();
            $("#menuTitle").show();
            $("#loadTables").show();
            $("#loadReports").show();
        }
        //if the login is unsuccessful, the login form will be shown again
        else{
            $("#loginForm").show();
            $("#menuTitle").hide();
            $("#loadTables").hide();
            $("#loadReports").hide();
            alert("Login failed");
            console.log(data);
        }
    });
}

function logout()
{
    //To send the logout request to the server
    $.post("logout.php",function(data){
        //To reload the page
        location.reload();  
    }
    );
}