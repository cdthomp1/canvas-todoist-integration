# Canvas Todoist Integration 

## Project Requirements
### Base Requirements
- [ ] Login to Canvas Student Account
- [ ] Get Student Courses and create Todoist Project for each course
- [ ] Add all calendar items from each course to their respective Todoist Project as tasks (Incorporate the due date and time)



Example get all current courses From the Dashboard endpoint
```json
{
    longName: 'Web Backend Development I - CSE 340',
    shortName: 'Web Backend Development I',
    originalName: 'Web Backend Development I',
    courseCode: 'CSE 340',
    assetString: 'course_127538',
    href: '/courses/127538',
    term: 'Winter 2021',
    subtitle: 'enrolled as: Student',
    enrollmentType: 'StudentEnrollment',
    observee: null,
    id: 127538,
    isFavorited: true,
    image: 'https://instructure-uploads.s3.amazonaws.com/account_107060000000000001/attachments/1642692/dashboard.jpg',
    position: null,
    links: [ [Object] ],
    published: true,
    canChangeCourseState: false,
    defaultView: 'wiki',
    pagesUrl: 'https://byui.instructure.com/courses/127538/pages',
    frontPageTitle: 'Course Homepage'
  }
```

What we need to create a project
```javascript
{
    name: 'PROJECT NAME',
    color: 39
}
```
Ask the user if they want one of the following for a project name:
 - [ ] Course Code { CSE 340 }
 - [ ] Short Name { Web Backend Development I }
 - [ ] Long Name { Web Backend Development I - CSE 340 }