export interface User {
    firstName: string,
    lastName: string,
    type: 'student' | 'teacher',
    id: string,
    classID: string | null,
    data: WorkData,

}

export interface WorkData {
    assignments: Assignment[],
}


export interface Assignment {
    points: number | null,
    score: number | null,
    type: 'lesson' | 'quiz' | 'lab' | 'project' | 'practice',
    progress: Progress,
    name: string,
    contentURL: string,
    extra?: number,
    comments?: Comment
}

interface Comment {
    from: string,
    content: string
}

type Progress = 'not started' | 'in progress' | 'complete';