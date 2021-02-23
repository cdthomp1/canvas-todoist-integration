require('dotenv').config()
const fetch = require('node-fetch');


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

module.exports = createProject