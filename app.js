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

            // Creating New ID for the deletion and insertion of the item
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // New item creatiuon based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(type, des, val);

            } else
            if (type === 'inc') {
                newItem = new Income(type, des, val);
            }
            data.allItems[type].push(newItem);

            //returning newitem so that it can be used there as well
            return newItem;


        },

        display: function() {
            console.log(data);
        }
    };

})();


var UIcontroller = (function() {

    var DOMstrings = {
        inputStrings: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn ',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',

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

        },
        addListItem: function(obj, type) {
            var html, newhtml, element;
            if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class = "item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class= "item__percentage">21 %</div><div class ="item__delete"><button class ="item__delete--btn"><i class = "ion-ios-close-outline"></i></button ></div></div></div>';
            } else if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class = "right clearfix"><div class = "item__value">%value%</div><div class ="item__delete"><button class ="item__delete--btn"><i class = "ion-ios-close-outline"></i></button></div></div></div>';

            }
            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
        }
    }

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

        var input, newItem;
        input = UICtrl.getInput();
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        budgetCtrl.display();

        UICtrl.addListItem(newItem, input.type);

    }


    return {
        init: function() {

            setUpEventListner();
        }
    };



})(budgetController, UIcontroller);



controller.init();