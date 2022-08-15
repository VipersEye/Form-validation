class Form {
    static #instance = null;

    constructor(formId) {
        if (Form.#instance !== null) {
            return Form.#instance;
        }

        this.form = document.querySelector(`#${formId}`);
        let formInputs = this.form.querySelectorAll('.form__input');
        for (let input of formInputs) {
            this[input.name] = input;
        }
        this.submitBtn = document.querySelector('.form__btn');

        this.validator = new FormValidator(this);

        Form.#instance = this;
    }

    clearForm() {
        let inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
    }
}

class FormValidator {
    constructor(formObject) {
        let inputs = formObject.form.querySelectorAll('.form__input');

        const checkZipCodeValidity = (inputSelect) => {
            let country = formObject.country.value;
            let zipCode = inputSelect.value;
            let reportMessage = '';
            switch (true) {
                case (country === 'USA' && (zipCode < 1 || zipCode > 99950)):
                    reportMessage = 'USA zip code from 00001 to 99950';
                    break;
                case (country === 'France' && (zipCode < 1000 || zipCode > 95880)):
                    reportMessage = 'France zip code from 01000 to 95880';
                    break;
                case (country === 'Spain' && (zipCode < 1001 || zipCode > 52006)):
                    reportMessage = 'Spain zip code from 01001 to 52006';
                    break;
                case (country === 'Italy' && (zipCode < 10 || zipCode > 98168)):
                    reportMessage = 'Italy zip code from 00010 to 98168';
                    break;
                case (country === 'Germany' && (zipCode < 1001 || zipCode > 28199)):
                    reportMessage = 'Germany zip code from 01001 to 28199';
                    break;
                case (country === 'Greece' && (zipCode < 10431 || zipCode > 11852)):
                    reportMessage = 'Greece zip code from 10431 to 11852';
                    break;
            }
            inputSelect.setCustomValidity(reportMessage);
        };

        const checkPasswordEquality = (input) => {
            let password = form.password.value;
            let passwordConfirm = form['password-confirm'].value;
            let reportMessage = ''
            if (password !== passwordConfirm) {
                reportMessage = 'Passwords not equal';
            }
            input.setCustomValidity(reportMessage);
        }

        const checkInputValidity = (input) => {
            input.setCustomValidity('');
            input.removeEventListener('blur', reportValidation);
            if (input.id === 'input-zip-code') {
                checkZipCodeValidity(input);
            } else if (input.id === 'input-password-conf') {
                checkPasswordEquality(input);
            }
            return input.checkValidity();
        };

        const reportValidation = (e) => {
            if (checkInputValidity(e.target) === false) {
                e.target.reportValidity();
            }
        };

        inputs.forEach(input => {
            input.addEventListener('click', (e) => {
                e.target.addEventListener('blur', reportValidation);
            });
        });

        formObject.country.addEventListener('change', (e) => {
            let zipCodeInput = formObject['zip-code'];
            if (checkInputValidity(zipCodeInput) === false) {
                zipCodeInput.reportValidity();
            }
        });

        formObject['zip-code'].addEventListener('input', reportValidation);

        const validateAllFields = (e) => {
            let allInputs = formObject.form.querySelectorAll('input');
            for (let input of allInputs) {
                let validity = checkInputValidity(input);
                if (validity === false) {
                    e.preventDefault();
                    input.reportValidity();
                    return;
                }
            }
        };

        formObject.submitBtn.addEventListener('click', validateAllFields);
    }

}

const form = new Form('form');