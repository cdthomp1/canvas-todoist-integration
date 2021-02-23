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
    await fetch('https://api.todoist.com/rest/v1/projects', {
        method: 'post',
        body:    JSON.stringify(course),
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.TODOIST_API_TOKEN}` },
    })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(error => console.error(error));
}

function courseToProject(course) {
    return { name: course.courseCode }
}

async function orchestrator() {
    var courses = await getCurrentCourses();
    await courses.map(courseToProject).forEach(createProject)
    
}

orchestrator();