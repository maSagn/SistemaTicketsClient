export class Result<T> {
    correct: boolean;
    errorMessage: string | null;
    ex: any;
    object: T;
    objects: T[] | null;

    constructor() {
        this.correct = false;
        this.errorMessage = null;
        this.ex = null;
        this.object = {} as T; // Iniciamos el objeto genérico con un valor vacío
        this.objects = null;
    }
}