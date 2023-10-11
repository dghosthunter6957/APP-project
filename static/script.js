var xhrRequest = new XMLHttpRequest()
var condition = "http://127.0.0.1:5000/displaytask" //default condition to build the table (build from json)

window.onload = display_task()

function random_id(){ //creating random ids
    var id = Math.floor(Math.random() * 10000000000000000000);
    return id

}
function add_task(){
    xhrRequest.open("PUT","http://127.0.0.1:5000/addtask",true)
    xhrRequest.setRequestHeader("Content-type","application/json; charset=utf-8")
    var task_to_add_data = 
        {TaskId: random_id(), //generate random id
        TaskName: document.getElementById("TaskName").value, //takes data from html form to send to flask server
        TaskDue: document.getElementById("TaskDue").value,
        TaskDesc: document.getElementById("TaskDesc").value,
        TaskPrio: document.getElementById("TaskPrio").value}
    var task_to_add_data_json = JSON.stringify(task_to_add_data)  //dictionary form
    xhrRequest.send(task_to_add_data_json) //send to flask
    location.reload() //remove form

}
function display_task(){
    xhrRequest.open("GET",condition,true)
    xhrRequest.onload = function(){
        var table_body = document.createElement("tbody") //table body
        var current_tasks = JSON.parse(xhrRequest.responseText) //get the tasks from flask server and json
        for (let i=0;current_tasks["Tasks"].length > i; i++){ //for each task
            var current_task_name = current_tasks["Tasks"][i].TaskName //create variables
            var current_task_due = current_tasks["Tasks"][i].TaskDue
            var current_task_desc = current_tasks["Tasks"][i].TaskDesc
            var current_task_prio = current_tasks["Tasks"][i].TaskPrio
            var current_row = document.createElement("tr") //create table row and data elements
            var current_data1 = document.createElement("td")
            var current_data2 = document.createElement("td")
            var current_data3 = document.createElement("td")
            var current_data4 = document.createElement("td")
            var current_delete_row = document.createElement("td") 
            var current_delete = document.createElement("button") //delete button
            current_delete.addEventListener('click',function(){ //when clicked
                var current_task_id = current_tasks["Tasks"][i].TaskId //specific to each task
                delete_task(current_task_id)})
            var delete_image = document.createElement("IMG") //button embedded in the image
            delete_image.setAttribute('src', '/static/bin.png')
            delete_image.setAttribute("width",40)
            delete_image.setAttribute("height",40)
            delete_image.alt = "Delete Button"
            current_delete.appendChild(delete_image) //image appended to button
            current_delete.classList.add('button_hover','delete_button')
            current_delete_row.appendChild(current_delete) //button appended to td
            current_data1.innerHTML = current_task_name
            current_data2.innerHTML = current_task_due
            current_data3.innerHTML = current_task_desc
            current_data4.innerHTML = current_task_prio
            current_row.appendChild(current_data1) //append variables to table row
            current_row.appendChild(current_data2)
            current_row.appendChild(current_data3)
            current_row.appendChild(current_data4)
            current_row.appendChild(current_delete_row)
            table_body.appendChild(current_row) //append row to table body
        }
        document.getElementById("task_data_table").appendChild(table_body) //append body to table
    }
    xhrRequest.send()

}
function clear_list_table(){
    const list_table = document.getElementById('task_data_table') 
    const tbody = list_table.querySelector('tbody') //find table body and remove it
    list_table.removeChild(tbody)
   
}
function sort_priority_H2L(){
    condition = "http://127.0.0.1:5000/sortpriorityH2L" //highest to lowest 
    clear_list_table() //clear table
    display_task() //build table

}
function sort_priority_L2H(){
    condition = "http://127.0.0.1:5000/sortpriorityL2H" //lowest to highest
    clear_list_table()
    display_task()
    
}
function sort_datefurthest(){
    condition = "http://127.0.0.1:5000/sortdatefurthest" //furthest date first
    clear_list_table()
    display_task()
}
function sort_dateclosest(){
    condition = "http://127.0.0.1:5000/sortdateclosest" //closest date first
    clear_list_table()
    display_task()
}
function show_add_task(){
    document.getElementById("add_task_menu").classList.remove("hidden") //show form
    document.getElementById("add_task_menu").classList.add("visible")
    document.getElementById("list_box").classList.remove("visible")
    document.getElementById("list_box").classList.add("hidden")

}
function hide_add_task(){
    document.getElementById("add_task_menu").classList.remove("visible") //hide form
    document.getElementById("add_task_menu").classList.add("hidden")
    document.getElementById("list_box").classList.remove("hidden")
    document.getElementById("list_box").classList.add("visible")

}
function delete_task(current_task_id){
    const confirm_delete = confirm("To-Do List asks you to confirm the delete."); //alert box to confirm
    if (confirm_delete){
        const current_taskId = JSON.stringify(current_task_id) //variable for the id
        xhrRequest.open("DELETE","http://127.0.0.1:5000/deletetask",true)
        xhrRequest.setRequestHeader("Content-type","application/json; charset=utf-8")
        xhrRequest.send(current_taskId) //sends id
        location.reload() //reloads page with updated data
    }

}
