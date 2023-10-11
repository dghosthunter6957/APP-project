from flask import Flask, render_template, jsonify, request, Response
import json
app = Flask(__name__)

@app.route('/') #default
def return_home():
   return render_template("index.html")

@app.put('/addtask') #adding a task to json
def add_task():
   task_to_add = request.get_json()
   f=open("./data1.json","r") #open file
   tasks = json.load(f)
   tasks['Tasks'].append(task_to_add) #add task
   f.close()
   f=open("./data1.json","w")
   json.dump(tasks,f) #write back
   return Response(status=200)

@app.get('/displaytask')
def display_task():
   f=open("./data1.json","r")
   current_tasks = json.load(f) #load tasks into python
   f.close()
   return jsonify(current_tasks) #send tasks to js

@app.get('/sortdatefurthest')
def sort_datefurthest():
   f=open("./data1.json","r")
   current_tasks = json.load(f)
   f.close()
   current_tasks['Tasks'].sort(key=lambda x:x['TaskDue'],reverse=True) #sort by date (furthest date first)
   return jsonify(current_tasks)

@app.get('/sortdateclosest')
def sort_dateclosest():
   f=open("./data1.json","r")
   current_tasks = json.load(f)
   f.close()
   current_tasks['Tasks'].sort(key=lambda x:x['TaskDue']) #sort by date (closest date firts)
   return jsonify(current_tasks)

@app.get('/sortpriorityH2L')
def sort_priorityH2L():
   f=open("./data1.json","r")
   current_tasks = json.load(f)
   f.close()
   def sort_by_priority(current_tasks):
      priority_order_high_low = {"Low": 2, "High": 0, "Medium": 1, "None":3} #priority list, sorts the numbers and the numbers replace the priority of a task
      return priority_order_high_low[current_tasks["TaskPrio"]]
   current_tasks['Tasks'].sort(key=sort_by_priority)#sort by prio 
   return jsonify(current_tasks)

@app.get('/sortpriorityL2H')
def sort_priorityL2H():
   f=open("./data1.json","r")
   current_tasks = json.load(f)
   f.close()
   def sort_by_priority(current_tasks):
      priority_order_high_low = {"Low": 1, "High": 3, "Medium": 2, "None":0}#opposite priority list to before
      return priority_order_high_low[current_tasks["TaskPrio"]]
   current_tasks['Tasks'].sort(key=sort_by_priority)#sort by prio
   return jsonify(current_tasks)

@app.delete('/deletetask')
def delete_task():
   f=open("./data1.json","r")
   current_tasks = json.load(f)
   task_Id = request.get_json()
   for i in range (len(current_tasks['Tasks'])):
      if current_tasks['Tasks'][i]['TaskId'] == task_Id: #if the task matches that of what is sent from js, delete the task from the python dictionary
         del current_tasks['Tasks'][i]
         break  #stop the loop
   f.close()
   f=open("./data1.json","w")
   json.dump(current_tasks,f) # write new dictionary back
   return Response(status=200)

if __name__ == '__main__':
   app.run()