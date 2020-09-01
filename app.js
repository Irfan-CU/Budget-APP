var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            var newItem, TD;
            if (type === 'exp') {
                newItem = new Expense(type, des, val);

            } else if (type === 'inc') {
                newItem = new Income(type, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
            //console.log(data.allItems[type]);

        }
    };

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
        getDOMStrings: function() {
            return DOMstrings;

        }
    };

})();

var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListner = function() {
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e) {
            if (e.code === 'Enter' || e.which === 13 || e.keyCode === 13) {
                ctrlAddItem();
            }
        });
    }


    var DOM = UICtrl.getDOMStrings();


    var ctrlAddItem = function() {
        var dataObject = UICtrl.getInput();
        console.log(dataObject.description);
        budgetCtrl.newds(dataObject.type, dataObject.description, dataObject.value);

    }


    return {
        init: function() {

            setUpEventListner();
        }
    };



})(budgetController, UIcontroller);



controller.init();