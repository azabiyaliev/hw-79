export interface Category {
    id: string;
    title: string;
    description: string;
}

export type CategoryWithoutID = Omit<Category, "id">

export interface Location {
    id: string;
    title: string;
    description: string;
}

export type LocationWithoutID = Omit<Location, "id">

export interface Subject {
    id: string;
    category_id: string;
    category_location: string;
    title: string;
    description: string;
    image: string;
    date: string;
}

export type SubjectWithoutID = Omit<Subject, "id">