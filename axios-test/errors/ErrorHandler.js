import CustomError from './CustomError.js';

export const createCustomError = (message) => new CustomError(message);

export const handleErrors = (error, fetchError) => {
    if (error.response) {
        const errorMessage = error.response.data.Error || error.response.data.error;
        console.error("Błąd:", errorMessage);
        fetchError.value = createCustomError(errorMessage);
    } else {
        console.error("Nieznany błąd. Spróbuj ponownie później.");
        fetchError.value = createCustomError("Nieznany błąd. Spróbuj ponownie później.");
    }
};