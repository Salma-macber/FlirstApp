"use strict";
console.log("Hello World");
console.log(Math.floor(Math.random() * 100));
function add(a = 1, b, c) {
    if (c) {
        return a + b + c;
    }
    return a + b;
}
console.log(add(1, 2));
function addRest(...numbers) {
    let sum = 0;
    for (const number of numbers) {
        sum += number;
    }
    return sum;
}
console.log(addRest(1, 2, 3, 4, 5));
const numbers = [1, 2, 3, 4, 5, +true];
console.log(addRest(...numbers));
let name = "John";
const user = {
    name: "John",
    age: 20,
    email: "john@gmail.com"
};
console.log(name);
console.log(user);
function getAction(btns) {
    console.log('Action for Up: ', btns.up);
    console.log('Action for Down: ', btns.down);
    console.log('Action for Left: ', btns.left);
    console.log('Action for Right: ', btns.right);
}
const buttons = {
    up: "up",
    down: "down",
    left: "left",
    right: "right"
};
const buttons2 = {
    up: "up2",
    down: "down2",
    left: "left2",
    right: "right2"
};
getAction(buttons);
getAction(buttons2);
const lastElement = {
    up: "up2",
    down: "down2",
    left: "left2",
    right: "right2",
    space: "space2",
    ctrl: "ctrl2"
};
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["USER"] = "user";
})(Role || (Role = {}));
const role = Role.ADMIN;
console.log(role);
const tuple = ["John", 20, true];
console.log(tuple);
console.log(tuple);
const tupleOptional = ["John", 20, true];
console.log(tupleOptional);
tupleOptional.push("Jane", 21);
console.log(tupleOptional);
function logger(message) {
    console.log(message);
}
console.log(logger("Hello World"));
function loggerWithReturn(message) {
    return message;
}
console.log(loggerWithReturn("Hello World With Return"));
const assertion = "Hello World";
console.log(assertion);
const userInterface = {
    name: "John",
    name2: "John2",
    age: 20,
    age2: 22,
    email: "john@gmail.com"
};
const personInterfaceObject = {
    name: "John",
    age: 20,
    name2: "John2",
    age2: 22,
    email: "john@gmail.com",
    phone: 1234567890
};
class UserClass {
    constructor() {
        this.name = "John";
        this.age = 20;
        this.email = "john@gmail.com";
    }
}
const userClass = new UserClass();
console.log(userClass.email);
class PersonClass extends UserClass {
    constructor(phone) {
        super();
        this.phone = phone;
        this.phone = 1234567890;
    }
    getPhone() {
        return this.phone;
    }
}
const personClass = new PersonClass(1234567890);
console.log(personClass.email);
console.log(personClass.getPhone());
//# sourceMappingURL=demo.js.map