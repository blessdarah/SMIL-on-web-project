const form = document.querySelector('form');

/* form buttons */
const stepOneButton = document.querySelector('#step-one-button');

/* Form fields */
const inputType = document.querySelector('#inputType');

stepOneButton.addEventListener('click', e => {
    e.preventDefault();
    console.log('form content type: ', form.contentType);

});