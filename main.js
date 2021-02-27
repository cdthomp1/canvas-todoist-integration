require('dotenv').config()
const fetch = require('node-fetch');

var headers = {
    'Authorization': 'Bearer ' + process.env.CANVAS_API_TOKEN
}

async function getCurrentCourses() {
    var courses = await fetch("https://byui.instructure.com/api/v1/dashboard/dashboard_cards", { headers })
        .then(res => { return res.json() })
    return courses
}

async function createProject(course) {
    var headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.TODOIST_API_TOKEN}` }
    var project = await fetch('https://api.todoist.com/rest/v1/projects', {
        method: 'post',
        body: JSON.stringify(course),
        headers: { headers },
    })
        .then(res => { return res.json() })

    return project;
}

function courseToProject(course) {
    return { name: course.courseCode }
}

async function courseAssignments(course) {
    var assignments = await fetchRequest(`https://byui.instructure.com/api/v1/courses/${course.id}/assignments`);
    return assignments;
}

async function fetchRequest(url) {
    try {
        // Fetch request and parse as JSON
        const response = await await fetch(url, { headers });
        let assignments = await response.json();

        // Extract the url of the response's "next" relational Link header
        let next_page;
        if (/<([^>]+)>; rel="next"/g.exec(response.headers.get("link")))
            next_page = /<([^>]+)>; rel="next"/g.exec(response.headers.get("link"))[1];

        // If another page exists, merge it into the array
        // Else return the complete array of paginated output
        if (next_page) {
            let temp_assignments = await fetchRequest(next_page);
            assignments = assignments.concat(temp_assignments);
        }

        return assignments;
    } catch (err) {
        return console.error(err);
    }
}

async function createProjectTask(projectId, task) {

    var refinedTask = {
        project_id: projectId.id,
        content: task.content,
        due_datetime: task.due_datetime
    }
    console.log(refinedTask)
    sleep(4000);
    await fetch('https://api.todoist.com/rest/v1/tasks', {
        method: 'post',
        body: JSON.stringify(refinedTask),
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.TODOIST_API_TOKEN}` },
    })
        .then(res => console.log(res))
        .then(res => res.json())
        .catch(error => {
            console.error(error);
            console.log(refinedTask)
        });
}

function assignmentToTask(assignment) {
    return {
        content: assignment.name,
        due_datetime: assignment.due_at
    }
}

async function orchestrator() {
    // Get today to filter past assignments
    var courses = await getCurrentCourses();
    var courseProjects = courses.map(courseToProject)

    var promiseProjects = await courseProjects.map(createProject)
    var projects = await Promise.all(promiseProjects).then(projects => { return projects });

    courses.forEach(async (course) => {
        var assignments = await courseAssignments(course);
        var project = projects.filter(project => project.name === course.courseCode)
        var assignmentTasks = assignments
            // Some assignments don't have due dates 
            .filter(assignment => assignment.due_at !== null)
            // If I run this during the semester, I don't need tasks that already past 
            .filter(assignment => {
                let today = new Date();
                var assignmentDueDate = new Date(assignment.due_at);
                return assignmentDueDate > today
            })
            .map(assignmentToTask)

        assignmentTasks.map(task => createProjectTask(project[0], task))
    })
}

orchestrator();


function sleep(milliseconds) {
    console.log('Sleeping....')
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
    console.log("Awake!")
}