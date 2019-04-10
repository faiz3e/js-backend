const validator = require('validator')
const isEmpty = require('./validator')

module.exports = function validateRegisterInput(data) {
        console.log('data',data);
        
    let errors = {}
    if (!validator.isLength(data.name), { min: 2, max: 30 }) {
        errors.name = 'Name must be between 2 to 30 char'
    }
    console.log('errors',errors);
    
    return {
        errors:errors,
        isValid: isEmpty(errors)
    }
}