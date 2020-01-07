/** User information to retrieve on login. */
export interface User {
    firstName: string,
    lastName: string,
    type: 'student' | 'teacher',
    /** UUID */
    id: string,
    /** ID of teacher's classroom. */
    classID: string | null,
    workData: WorkData[],
    settings: UserSettings | null,
}

interface UserSettings { 
    theme: 'dark' | 'light' | 'auto',
    codePreference: 'online' | 'offline',
}

/** Course URL paired with user's course work. */
interface WorkData {
    course: string,
    work: Assignment[],
}

/** User's work per CourseContent, without the content. */
interface Assignment {
    score: number | null,
    progress: Progress,
    comments: Comment[] | null,
    /** ID of corresponding CourseContent object. */
    id: string,
}

interface Comment {
    from: string,
    content: string
}

type Progress = 'not started' | 'in progress' | 'complete';