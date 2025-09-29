console.log("Hello World");
console.log(Math.floor(Math.random() * 100));
// add a new line

// c? is optional parameter
//a: number = 1 is default parameter
function add(a: number = 1, b: number, c?: number): number {
    if (c) {
        return a + b + c;
    }
    return a + b;
}

console.log(add(1, 2));
//+true is 1
//+false is 0
//+null is 0
//+undefined is 0
//+NaN is NaN
//+Infinity is Infinity
//-Infinity is -Infinity
//Rest parameter
function addRest(...numbers: number[]): number {
    let sum = 0;
    for (const number of numbers) {
        sum += number;
    }
    return sum;
}

console.log(addRest(1, 2, 3, 4, 5));
//Spread operator
const numbers = [1, 2, 3, 4, 5, +true];
console.log(addRest(...numbers));

//Type Alias
//Type Alias is a way to give a name to a type
type st = string;
let name: st = "John";
type User = {
    name: string;
    age: number;
    email: string;
}

const user: User = {
    name: "John",
    age: 20,
    email: "john@gmail.com"
}

console.log(name);
console.log(user);

type Buttons = {
    up: string;
    down: string;
    left: string;
    right: string;
}
function getAction(btns: Buttons) {
    console.log('Action for Up: ', btns.up);
    console.log('Action for Down: ', btns.down);
    console.log('Action for Left: ', btns.left);
    console.log('Action for Right: ', btns.right);
}
const buttons: Buttons = {
    up: "up",
    down: "down",
    left: "left",
    right: "right"
}
const buttons2: Buttons = {
    up: "up2",
    down: "down2",
    left: "left2",
    right: "right2"
}
getAction(buttons);
getAction(buttons2);

type Last = Buttons & {
    space: string;
    ctrl: string;

}
const lastElement: Last = {
    up: "up2",
    down: "down2",
    left: "left2",
    right: "right2",
    space: "space2",
    ctrl: "ctrl2"
}
//Enum
enum Role {
    ADMIN = "admin",
    USER = "user"
}

const role: Role = Role.ADMIN;
console.log(role);
//Tuple Type
type Tuple = readonly [string, number, boolean];
const tuple: Tuple = ["John", 20, true];
console.log(tuple);
// tuple.push("Jane", 21, false); //this is wrong with readonly
console.log(tuple);
//Tuple Type with optional
type TupleOptional = [string, number, boolean?];
const tupleOptional: TupleOptional = ["John", 20, true];
console.log(tupleOptional);
tupleOptional.push("Jane", 21);
console.log(tupleOptional);
//function type
function logger(message: string): void {
    console.log(message);
}
console.log(logger("Hello World"));
//function type with return type
function loggerWithReturn(message: string): string {
    return message;
}
console.log(loggerWithReturn("Hello World With Return"));
// never function
// function neverFunction(): never {
//     throw new Error("Never Function");
//     // return "Never Function";//this is wrong
// }
// console.log(neverFunction());
//or 
// function alwaysReturn(): never {
//     while (true) {
//         console.log("Always Return");
//     }
//     // return "Always Return";//this is wrong
// }
// console.log(alwaysReturn());
//assertion
const assertion = "Hello World" as string;
console.log(assertion);
// let myImg = document.getElementById("img") as HTMLImageElement;
// console.log(myImg.src);//src is a property of HTMLImageElement but value is not defined
//interface and reopen same interface
interface UserInterface {
    name: string;
    age: number;
    email: string;
}
interface UserInterface {
    name2?: string;
    age2?: number;
}
const userInterface: UserInterface = {
    name: "John",
    name2: "John2",
    age: 20,
    age2: 22,
    email: "john@gmail.com"
}
interface PersonInterface extends UserInterface {
    phone: number;
}
const personInterfaceObject: PersonInterface = {
    name: "John",
    age: 20,
    name2: "John2",
    age2: 22,
    email: "john@gmail.com",
    phone: 1234567890
}
//private and protected
class UserClass {
    private name: string = "John";
    protected age: number = 20;
    public email: string = "john@gmail.com";
}
const userClass: UserClass = new UserClass();
// console.log(userClass.name);
// console.log(userClass.age);
console.log(userClass.email);
//private and protected
class PersonClass extends UserClass {
    constructor(private phone: number) {
        super();
        this.phone = 1234567890;
    }
    getPhone() {
        return this.phone;
    }
}
const personClass: PersonClass = new PersonClass(1234567890);
console.log(personClass.email);
console.log(personClass.getPhone());


////////////////////////////////////

//Generic
function identity<T>(arg: T): T {
    return arg;
}
console.log(identity<string>("Hello World"));
console.log(identity<number>(1234567890));
console.log(identity<boolean>(true));
console.log(identity<string[]>(["Hello", "World"]));
console.log(identity<number[]>([1, 2, 3, 4, 5]));
console.log(identity<boolean[]>([true, false, true]));

//Generic with multiple types
function merge<T, U>(a: T, b: U): T & U {
    return { ...a, ...b };
}
console.log(merge<string, number>("Hello", 1234567890));
console.log(merge<string, boolean>("Hello", true));
console.log(merge<number, boolean>(1234567890, true));
console.log(merge<string[], number[]>(["Hello", "World"], [1, 2, 3, 4, 5]));
console.log(merge<number, boolean[]>(1234567890, [true, false, true]));

function combine2<T, S>(a: T, b: S): String {
    return 'the value is ' + a + ' and ' + b;
}
console.log(combine2<string, number>("Hello", 1234567890));
console.log(combine2<string, boolean>("Hello", true));
console.log(combine2<number, boolean>(1234567890, true));
console.log(combine2<string[], number[]>(["Hello", "World"], [1, 2, 3, 4, 5]));
console.log(combine2<number, boolean[]>(1234567890, [true, false, true]));

//Generic with class
class GenericClass<T, S> {
    constructor(private a: T, private b: S) {
        this.a = a;
        this.b = b;
    }
    getA() {
        return this.a;
    }
    getB() {
        return this.b;
    }
}
const genericClass: GenericClass<string, number> = new GenericClass<string, number>("Hello", 1234567890);
console.log(genericClass.getA());
console.log(genericClass.getB());
const genericClass2: GenericClass<number, String[]> = new GenericClass<number, String[]>(1234567890, ["Hello", "World"]);
console.log(genericClass2.getA());
console.log(genericClass2.getB());
const genericClass3: GenericClass<number | String, String[]> = new GenericClass<number | String, String[]>('1234567890', ["Hello", "World"]);
console.log(genericClass3.getA());
console.log(genericClass3.getB());

//interface with generic
interface Book {
    title: string;
    author: string;
    pages: number;
}
interface Game{
    title: string;
    style: string;
    rating: number;
    price: number;
}
class Collection<T>{
    private items: T[] = [];
    add(item: T){
        this.items.push(item);
    }
    getItems(){
        return this.items;
    }
}
const collection: Collection<Book> = new Collection<Book>();
collection.add({ title: "The Great Gatsby", author: "F. Scott Fitzgerald", pages: 180 });
collection.add({ title: "1984", author: "George Orwell", pages: 328 });
console.log(collection.getItems());
const collection2: Collection<Game> = new Collection<Game>();
collection2.add({ title: "The Witcher 3", style: "RPG", rating: 9.5, price: 59.99 });
collection2.add({ title: "Fortnite", style: "Battle Royale", rating: 8.5, price: 0 });
console.log(collection2.getItems());