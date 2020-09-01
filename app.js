var budgetController = (function() {

})();


var UIcontroller = (function() {

    var DOMstrings = {
        inputStrings: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn '
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputStrings).value, //either inc or exp the way its set in HTML
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMStrings = function() {
            return DOMstrings;

        }
    };

})();

var controller = (function(budgetCtrl, UICtrl) {

    var DOM = UIctrl.getDOMStrings();


    var ctrlAddItem = function() {
        var dataObject = UICtrl.getInput();
        console.log(dataObject);
    }



    document.querySelector(DOM.inputButton).addEventListener('click', function() {
        ctrlAddItem();

    })
    document.addEventListener('keypress', function(e) {
        if (e.code === 'Enter' || e.which === 13 || e.keyCode === 13) {

        }
    })


})(budgetController, UIcontroller);