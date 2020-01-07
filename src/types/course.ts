export interface Course {
    name: string,
    language: string,
    description: string,
    id: string,
    content: CourseContent[],
}

type CourseContentType = 'lesson' | 'quiz' | 'lab' | 'project' | 'practice'

interface CourseContentBase {
    type: CourseContentType,
    name: string,
    points: number | null,
    due: number | null,
    description: string | null,
    extra: boolean | null,
    id: string,
}

// unfinished
interface CourseLesson extends CourseContentBase {
    type: 'lesson',
}

interface CourseQuiz extends CourseContentBase {
    type: 'quiz',
    questions: QuizQuestion[],
}

interface QuizQuestion {
    question: string,
    options: string[],
    correct: string,
}

//unfinished
interface CourseLab extends CourseContentBase {
    type: 'lab'
}

//unfinished
interface CourseProject extends CourseContentBase {
    type: 'project'
}

interface CoursePractice extends CourseContentBase {
    type: 'practice'
    tasks: string[],
}

export type CourseContent = CourseLesson | CourseQuiz | CourseLab | CourseProject | CoursePractice;