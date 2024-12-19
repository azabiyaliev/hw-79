export interface Category {
    id: string;
    title: string;
    description: string;
}

export type CategoryWithoutID = Omit<Category, "id">

export interface location {
    id: string;
    title: string;
    description: string;
}

export interface subjectOfAccounting {
    id: string;
    category_id: string;
    category_location: string;
    title: string;
    description: string;
    image: string;
    date: string;
}