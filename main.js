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
    var project = await fetch('https://api.todoist.com/rest/v1/projects', {
        method: 'post',
        body: JSON.stringify(course),
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.TODOIST_API_TOKEN}` },
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
        project_id: projectId,
        content: task.content,
        due_datetime: task.due_datetime
    }
    console.log(refinedTask)
    /* await fetch('https://api.todoist.com/rest/v1/tasks', {
        method: 'post',
        body: JSON.stringify(refinedTask),
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.TODOIST_API_TOKEN}` },
    })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(error => console.error(error)); */
}

function assignmentToTask(assignment) {
    return {
        content: assignment.name,
        due_datetime: assignment.due_at
    }
}

async function orchestrator() {
    var courses = await getCurrentCourses();
    console.log(courses)
    var projects = await courses.map(courseToProject).map(createProject)
    console.log(projects)
    // Create Tasks 
    //var assignments = await courseAssignments(courses[5])
    //assignments.map(assignmentToTask).map(task => createProjectTask(projects[0], task))

}

orchestrator();