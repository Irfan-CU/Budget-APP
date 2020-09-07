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
    var calculateTotal = function(type) {
        var sum;
        sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.total[type] = sum;
    }


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // Creating New ID for the deletion and insertion of the item
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // New item creatiuon based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);

            } else
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);

            //returning newitem so that it can be used there as well
            return newItem;


        },


        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.total.inc - data.total.exp;
            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;

            }


        },
        testing: function() {
            console.log(data);
        },

        getBudget: function() {

            return {
                budget: data.budget,
                incomes: data.total.inc,
                expenses: data.total.exp,
                percentage: data.percentage
            }
        },

        delelteItem: function(type, id) {

            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (id !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        contianer: '.container',


    }



    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputStrings).value, //either inc or exp the way its set in HTML
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        getDOMStrings: function() {
            return DOMstrings;

        },
        addListItem: function(obj, type) {
            var html, newhtml, element;
            if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class = "item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class= "item__percentage">21 %</div><div class ="item__delete"><button class ="item__delete--btn"><i class = "ion-ios-close-outline"></i></button ></div></div></div>';
            } else if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class = "right clearfix"><div class = "item__value">%value%</div><div class ="item__delete"><button class ="item__delete--btn"><i class = "ion-ios-close-outline"></i></button></div></div></div>';

            }
            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
        },

        deleteListItem: function(selectorID) {
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(currentVal, index, array) {
                currentVal.value = "";
            });
            fieldsArray[0].focus();

        },

        displayBudget: function(Obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = Obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = Obj.incomes;
            document.querySelector(DOMstrings.expensesLabel).textContent = Obj.expenses;
            document.querySelector(DOMstrings.percentageLabel).textContent = Obj.percentage;
            if (Obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = Obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '-------'
            }

        },
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
        document.querySelector(DOM.contianer).addEventListener('click', ctrlDeleteItem);

    }


    var DOM = UICtrl.getDOMStrings();

    var updateBudget = function() {

        var budget;

        budgetCtrl.calculateBudget();

        budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);




    }
    var ctrlAddItem = function() {

        var input, newItem;
        input = UICtrl.getInput();
        if (!isNaN(input.value) && input.value > 0 && input.description !== "") {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);

            UICtrl.clearFields();

            updateBudget();
        }


    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.delelteItem(type, ID);

            UICtrl.deleteListItem(itemID);

            updateBudget();


        }

    }

    return {
        init: function() {

            UICtrl.displayBudget({
                budget: 0,
                incomes: 0,
                expenses: 0,
                percentage: -1
            })
            setUpEventListner();
        }
    };



})(budgetController, UIcontroller);



controller.init();
controller.init();