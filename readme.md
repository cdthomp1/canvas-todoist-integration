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


 Example Canvas Assignment Object
 ```json
 {
    id: 5146789,
    description: '<link rel="stylesheet" href="https://instructure-uploads.s3.us-east-1.amazonaws.com/account_107060000000000001/attachments/29434606/online_1-9-2020.css"><div class="byui cse340">\r\n' +
      '<p><strong>The code for Enhancement 7 must be submitted for professor review as a zip file.</strong></p>\r\n' +
      '<ol>\r\n' +
      '<li><strong>Zip the phpmotors folder containing the code for the enhancement.</strong></li>\r\n' +
      '<li><strong>Be sure the zip file name includes the enhancement name: (e.g. enhancement7.zip).</strong></li>\r\n' +
      '<li><strong>Submit the file by clicking the "Submit Assignment" button, upload the zip file for this assignment, and paste the video URL and the GitHub URL into the comment field, and click the “Submit Assignment” button.</strong></li>\r\n' +
      '</ol>\r\n' +
      '</div>',
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
    secure_params: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsdGlfYXNzaWdubWVudF9pZCI6ImE3MmMwZWFkLTNlMTctNDY0Zi1iNTRjLTE3ZjY2MWZkYmNlYiJ9.KvtIDSJZ1rzxAW18u6Tfy4JRa5re_euHMVL7x6Gdebo',
    course_id: 127538,
    name: 'Enhancement 7 Code Submission',
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
    html_url: 'https://byui.instructure.com/courses/127538/assignments/5146789',
    published: true,
    only_visible_to_overrides: false,
    locked_for_user: false,
    submissions_download_url: 'https://byui.instructure.com/courses/127538/assignments/5146789/submissions?zip=1',
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