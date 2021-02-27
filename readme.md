# Canvas Todoist Integration Part 1

## Contents

-  [Overview](#overview)
-  [Project Requirements](#project-requirements)
-  [Installation](#installation)
-  [Evaluating Objects](#evaluating-objects)
-  [Putting it all together](#putting-it-all-together)
-  [Function Definitions](#function-definitions)
-  [Helper Function Definitions](#helper-function-definitions)
-  [Conclusion](#conclusion)

## Overview

I've always like being organized, but that gets tricky when school, work, and personal projects use a different system to organize tasks. I started using Todoist as a one stop place to organize tasks. Having to input tasks that I have by hand started to take its toll, especially when class's have dozens of assignments each. I did a little bit of digging and found that Todoist has a relatively easy to use REST API, which sparked the idea of making an API call to my schools LMS, Canvas, to get my class assignments and make another API call to Todoist to create the tasks for me.

[Todoist API Docs](https://developer.todoist.com/rest/v1/#overview)

[Canvas API Docs](https://canvas.instructure.com/doc/api/)

## Project Requirements

### Base Requirements

-  [ ] Login to Canvas Student Account
-  [ ] Get Student Courses and create Todoist Project for each course
-  [ ] Add all calendar items from each course to their respective Todoist Project as tasks (Incorporate the due date and time)

### Future Features

#### Custom Project Names

Ask the user if they want one of the following for a project name:

-  [ ] Course Code
-  [ ] Short Name
-  [ ] Long Name

## Installation 
After cloning this repo, run `npm i` to get the required packages (`node-fetch` and `dotenv`)

After the packages are installed, you will need to get your API tokens from Todoist and Canvas. 

Todoist Token Retrieval 

*The process to get the token is the same on all devices and platforms. 
- Click on your profile picture
- Click on the `Integrations` menu option
- Scroll down to the bottom where the API Token is
- Copy the token
- Create a `.env` file in the root of the project
- Type `TODOIST_API_TOKEN=` with your token after the equal sign 


Canvas Token Retrieval 

*The token can only be retrieved through the web client 
- Click on your profile picture
- Click on the settings menu option
- Scroll down past the `Approved Integrations` section and click on the button that says `+ New Access Token`
- The dialog will ask for some information about the use of your token and when you would like it to expire, fill it out how you see fit. 
- **If you decide to add an expiration date to your token, which is recommended` don't forget to get a new token when needed!**
- In your `.env` file, add `CANVAS_API_TOKEN=` on a new line with your token after the equal sign

### Run The Application 
Type `node main.js` to run the application and watch your life get easier. 

## Evaluating Objects

I need to get access to my current courses, since my institution keeps all my past courses that would be returned from the `/api/v1/courses` endpoint, I would need to filter to get the courses for the current term. However, I found an endpoint that will get the favorited courses that are on the dashboard. Notice in the object below that the `isFavorited` property is set to `true`.

Example get all current courses From the Dashboard endpoint

```javascript
{
    longName: 'Course Long Name',
    shortName: 'Course Short Name',
    originalName: 'Course Original Name',
    courseCode: 'COURSE 123',
    assetString: 'course_1234567',
    href: '/courses/1234567',
    term: 'Course Term',
    subtitle: 'enrolled as: Student',
    enrollmentType: 'StudentEnrollment',
    observee: null,
    id: 1234567,
    isFavorited: true,
    image: 'some/course/url',
    position: null,
    links: [ [Object] ],
    published: true,
    canChangeCourseState: false,
    defaultView: 'wiki',
    pagesUrl: 'some/course/url',
    frontPageTitle: 'Course Homepage'
  }
```

What we need to create a project

```javascript
{
   name: 'PROJECT NAME';
}
```

A color would be nice to add here, but I can add it later. To create a project is super easy, so I will only need to pull the title of the Course Object.

I then need to get all of the assignments for a course. This is a bigger call as courses can have dozens of assignments.

Example Canvas Assignment Object

```javascript
{
   id: 1234567,
   description: '<p>Some HTML string</p>',
   due_at: '2021-03-07T06:59:59Z',
   unlock_at: null,
   lock_at: null,
   points_possible: 0,
   grading_type: 'pass_fail',
   assignment_group_id: 722751,
   grading_standard_id: null,
   created_at: '2020-12-16T03:38:31Z',
   updated_at: '2020-12-28T20:04:35Z',
   peer_reviews: false,
   automatic_peer_reviews: false,
   position: 7,
   grade_group_students_individually: false,
   anonymous_peer_reviews: false,
   group_category_id: null,
   post_to_sis: false,
   moderated_grading: false,
   omit_from_final_grade: true,
   intra_group_peer_reviews: false,
   anonymous_instructor_annotations: false,
   anonymous_grading: false,
   graders_anonymous_to_graders: false,
   grader_count: 0,
   grader_comments_visible_to_graders: true,
   final_grader_id: null,
   grader_names_visible_to_final_grader: true,
   allowed_attempts: -1,
   secure_params: 'string',
   course_id: 1234567,
   name: 'NAME OF ASSIGNMENT',
   submission_types: [ 'online_text_entry', 'online_url', 'online_upload' ],
   has_submitted_submissions: false,
   due_date_required: false,
   max_name_length: 255,
   in_closed_grading_period: false,
   is_quiz_assignment: false,
   can_duplicate: true,
   original_course_id: null,
   original_assignment_id: null,
   original_assignment_name: null,
   original_quiz_id: null,
   workflow_state: 'published',
   muted: true,
   html_url: 'some/course/url',
   published: true,
   only_visible_to_overrides: false,
   locked_for_user: false,
   submissions_download_url: 'some/course/url',
   post_manually: false,
   anonymize_students: false,
   require_lockdown_browser: false
 }
```

What we need for a task object

```javascript
{
   content: 'TASK NAME',
   due_datetime: '2021-03-07T06:59:59Z'
}
```

The Canvas Assignment object is large, but we only need a few property values to create a Task. The name of the assignment and the due date is all we currently need to create the task.

## Putting it all together

I need a handful of functions to help make this a little bit more organized.

Here are the functions I came up with:

-  `getCurrentCourses()`
-  `createProject(course)`
-  `courseToProject(course)`
-  `courseAssignments(course)`
-  `createProjectTask(projectId, task)`
-  `assignmentToTask(assignment)`
-  `orchestrator()`

This program was initially designed as a procedural program, as the `orchestrator` function calls other functions in a specific order. I also needed a few helper functions, to work through pagination for the Canvas API calls and to help slow the API calls that are made to Todoist as there is a 50 calls per minute limit for the REST API.

Helper functions:

-  `fetchRequest(url)` Helps check for any Canvas API calls that have pagination
-  `sleep(milliseconds)`

## Function Definitions

### `getCurrentCourses()`

```javascript
var headers = {
   Authorization: 'Bearer ' + process.env.CANVAS_API_TOKEN,
};

async function getCurrentCourses() {
   var courses = await fetch(
      '{CANVAS INSTANCE DOMAIN}/api/v1/dashboard/dashboard_cards',
      { headers }
   ).then((res) => {
      return res.json();
   });
   return courses;
}
```

### `createProject(course)`

```javascript
async function createProject(course) {
   var headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TODOIST_API_TOKEN}`,
   };

   var project = await fetch('https://api.todoist.com/rest/v1/projects', {
      method: 'post',
      body: JSON.stringify(course),
      headers: { headers },
   }).then((res) => {
      return res.json();
   });

   return project;
}
```

### `courseToProject(course)`

```javascript
function courseToProject(course) {
   return { name: course.courseCode };
}
```

### `courseAssignments(course)`

```javascript
async function courseAssignments(course) {
   var headers = {
      Authorization: 'Bearer ' + process.env.CANVAS_API_TOKEN,
   };
   var assignments = await fetchRequest(
      `{CANVAS INSTANCE DOMAIN}/api/v1/courses/${course.id}/assignments`,
      { headers }
   );
   return assignments;
}
```

### `createProjectTask(projectId, task)`

```javascript
async function createProjectTask(projectId, task) {
   var refinedTask = {
      project_id: projectId.id,
      content: task.content,
      due_datetime: task.due_datetime,
   };
   sleep(4000);
   await fetch('https://api.todoist.com/rest/v1/tasks', {
      method: 'post',
      body: JSON.stringify(refinedTask),
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${process.env.TODOIST_API_TOKEN}`,
      },
   })
      .then((res) => res.json())
      .catch((error) => {
         console.error(error);
      });
}
```

### `assignmentToTask(assignment)`

```javascript
function assignmentToTask(assignment) {
   return {
      content: assignment.name,
      due_datetime: assignment.due_at,
   };
}
```

### `orchestrator()`

```javascript
async function orchestrator() {
   var courses = await getCurrentCourses();
   var courseProjects = courses.map(courseToProject);

   var promiseProjects = await courseProjects.map(createProject);
   var projects = await Promise.all(promiseProjects).then((projects) => {
      return projects;
   });

   courses.forEach(async (course) => {
      var assignments = await courseAssignments(course);
      var project = projects.filter(
         (project) => project.name === course.courseCode
      );
      var assignmentTasks = assignments
         // Some assignments don't have due dates
         .filter((assignment) => assignment.due_at !== null)
         // If I run this during the semester, I don't need tasks that already past
         .filter((assignment) => {
            let today = new Date();
            var assignmentDueDate = new Date(assignment.due_at);
            return assignmentDueDate > today;
         })
         .map(assignmentToTask);

      assignmentTasks.map((task) => createProjectTask(project[0], task));
   });
}
```

## Helper Function Definitions

### `fetchRequest(url)`

```javascript
async function fetchRequest(url) {
   try {
      // Fetch request and parse as JSON
      const response = await await fetch(url, { headers });
      let assignments = await response.json();

      // Extract the url of the response's "next" relational Link header
      let next_page;
      if (/<([^>]+)>; rel="next"/g.exec(response.headers.get('link')))
         next_page = /<([^>]+)>; rel="next"/g.exec(
            response.headers.get('link')
         )[1];

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
```

[Function Source](https://stackoverflow.com/questions/62337587/return-paginated-output-recursively-with-fetch-api)

### `sleep(milliseconds)`

```javascript
function sleep(milliseconds) {
   const date = Date.now();
   let currentDate = null;
   do {
      currentDate = Date.now();
   } while (currentDate - date < milliseconds);
}
```

## Conclusion

This has some potential to be a nice tool to help Canvas users get their tasks organized. For example, making a nice website where a user can provide the needed credentials for their Canvas and Todoist instance will allow this tool to reach more users than those that are familiar with programing. There is still some work to be done to help make this tool function smoothly, even though I have a `sleep` function, there are calls that happen too fast and the program will exceed the 50 request per minute limit. Using Todoist's sync API has the potential to solve that.
