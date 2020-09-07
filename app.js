var budgetController = (function() {

    var Expense = function(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
        //adding function to the prototype so that all the objects inherit this function
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };


    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

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
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.total.inc);
            });
        },


        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
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
        inputType: '.add__type',
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
        expensesPercentageLabel: '.item__percentage',
        dateLable: '.budget__title--month',


    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };


    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //either inc or exp the way its set in HTML
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

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
            newhtml = newhtml.replace('%value%', formatNumber(obj.value, type));
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

            var type;
            Obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(Obj.budget, type);

            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(Obj.incomes, type);
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(Obj.expenses, type);
            document.querySelector(DOMstrings.percentageLabel).textContent = Obj.percentage;
            if (Obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = Obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '-------'
            }

        },
        displayMonth: function() {
            var now, year, month, months, day;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            day = now.getDate()
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLable).textContent = day + ' ' + months[month] + ' ' + year;
        },
        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType,
                DOMstrings.inputDescription,
                DOMstrings.inputValue
            );
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red')

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
        document.querySelector(DOM.contianer).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    }


    var DOM = UICtrl.getDOMStrings();

    var updateBudget = function() {

        var budget;

        budgetCtrl.calculateBudget();

        budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);




    };

    var updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();


        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };


    var ctrlAddItem = function() {

        var input, newItem;
        input = UICtrl.getInput();
        if (!isNaN(input.value) && input.value > 0 && input.description !== "") {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);

            UICtrl.clearFields();

            updateBudget();

            updatePercentages();
        }



    };

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

            updatePercentages();
        }

    };

    return {
        init: function() {

            UICtrl.displayMonth();

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