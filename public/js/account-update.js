'use strict';

// Client-side validation for account update form
function validateAccountUpdateForm() {
    const form = document.querySelector('.account-form[action="/account/update"]');
    if (!form) return;

    const firstName = form.querySelector('#account_firstname');
    const lastName = form.querySelector('#account_lastname');
    const email = form.querySelector('#account_email');
    const submitBtn = form.querySelector('button[type="submit"]');

    function validateField(field, validator) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) errorElement.remove();

        const isValid = validator(field.value);
        if (!isValid) {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.style.color = 'red';
            error.style.fontSize = '0.9em';
            error.style.marginTop = '5px';
            error.textContent = getErrorMessage(field.name);
            field.parentNode.appendChild(error);
            field.style.borderColor = 'red';
        } else {
            field.style.borderColor = 'green';
        }
        return isValid;
    }

    function getErrorMessage(fieldName) {
        const messages = {
            account_firstname: 'First name is required.',
            account_lastname: 'Last name is required.',
            account_email: 'Please enter a valid email address.'
        };
        return messages[fieldName] || 'This field is required.';
    }

    function validateFirstName(value) {
        return value.trim().length >= 1;
    }

    function validateLastName(value) {
        return value.trim().length >= 2;
    }

    function validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.trim());
    }

    function validateForm() {
        const isFirstNameValid = validateField(firstName, validateFirstName);
        const isLastNameValid = validateField(lastName, validateLastName);
        const isEmailValid = validateField(email, validateEmail);
        return isFirstNameValid && isLastNameValid && isEmailValid;
    }

    [firstName, lastName, email].forEach(field => {
        field.addEventListener('input', () => validateField(field, getValidator(field.name)));
        field.addEventListener('blur', () => validateField(field, getValidator(field.name)));
    });

    function getValidator(fieldName) {
        const validators = {
            account_firstname: validateFirstName,
            account_lastname: validateLastName,
            account_email: validateEmail
        };
        return validators[fieldName];
    }

    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            alert('Please correct the errors before submitting.');
        }
    });
}

// Client-side validation for password change form
function validatePasswordChangeForm() {
    const form = document.querySelector('.account-form[action="/account/update-password"]');
    if (!form) return;

    const password = form.querySelector('#account_password');
    const confirmPassword = form.querySelector('#confirm_password');
    const submitBtn = form.querySelector('button[type="submit"]');

    function validateField(field, validator) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) errorElement.remove();

        const isValid = validator(field.value);
        if (!isValid) {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.style.color = 'red';
            error.style.fontSize = '0.9em';
            error.style.marginTop = '5px';
            error.textContent = getErrorMessage(field.name);
            field.parentNode.appendChild(error);
            field.style.borderColor = 'red';
        } else {
            field.style.borderColor = 'green';
        }
        return isValid;
    }

    function getErrorMessage(fieldName) {
        const messages = {
            account_password: 'Password must be at least 12 characters and contain at least 1 number, 1 capital letter, and 1 special character.',
            confirm_password: 'Password confirmation does not match.'
        };
        return messages[fieldName] || 'This field is required.';
    }

    function validatePassword(value) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
        return passwordRegex.test(value);
    }

    function validateConfirmPassword(value) {
        return value === password.value;
    }

    function validateForm() {
        const isPasswordValid = validateField(password, validatePassword);
        const isConfirmValid = validateField(confirmPassword, validateConfirmPassword);
        return isPasswordValid && isConfirmValid;
    }

    password.addEventListener('input', () => {
        validateField(password, validatePassword);
        if (confirmPassword.value) validateField(confirmPassword, validateConfirmPassword);
    });
    password.addEventListener('blur', () => {
        validateField(password, validatePassword);
        if (confirmPassword.value) validateField(confirmPassword, validateConfirmPassword);
    });

    confirmPassword.addEventListener('input', () => validateField(confirmPassword, validateConfirmPassword));
    confirmPassword.addEventListener('blur', () => validateField(confirmPassword, validateConfirmPassword));

    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            alert('Please correct the errors before submitting.');
        }
    });
}

// Initialize validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    validateAccountUpdateForm();
    validatePasswordChangeForm();
});
