declare function add(a: number | undefined, b: number, c?: number): number;
declare function addRest(...numbers: number[]): number;
declare const numbers: number[];
type st = string;
declare let name: st;
type User = {
    name: string;
    age: number;
    email: string;
};
declare const user: User;
type Buttons = {
    up: string;
    down: string;
    left: string;
    right: string;
};
declare function getAction(btns: Buttons): void;
declare const buttons: Buttons;
declare const buttons2: Buttons;
type Last = Buttons & {
    space: string;
    ctrl: string;
};
declare const lastElement: Last;
declare enum Role {
    ADMIN = "admin",
    USER = "user"
}
declare const role: Role;
type Tuple = readonly [string, number, boolean];
declare const tuple: Tuple;
type TupleOptional = [string, number, boolean?];
declare const tupleOptional: TupleOptional;
declare function logger(message: string): void;
declare function loggerWithReturn(message: string): string;
declare const assertion: string;
interface UserInterface {
    name: string;
    age: number;
    email: string;
}
interface UserInterface {
    name2?: string;
    age2?: number;
}
declare const userInterface: UserInterface;
interface PersonInterface extends UserInterface {
    phone: number;
}
declare const personInterfaceObject: PersonInterface;
declare class UserClass {
    private name;
    protected age: number;
    email: string;
}
declare const userClass: UserClass;
declare class PersonClass extends UserClass {
    private phone;
    constructor(phone: number);
    getPhone(): number;
}
declare const personClass: PersonClass;
declare function identity<T>(arg: T): T;
declare function merge<T, U>(a: T, b: U): T & U;
declare function combine2<T, S>(a: T, b: S): String;
declare class GenericClass<T, S> {
    private a;
    private b;
    constructor(a: T, b: S);
    getA(): T;
    getB(): S;
}
declare const genericClass: GenericClass<string, number>;
declare const genericClass2: GenericClass<number, String[]>;
declare const genericClass3: GenericClass<number | String, String[]>;
interface Book {
    title: string;
    author: string;
    pages: number;
}
interface Game {
    title: string;
    style: string;
    rating: number;
    price: number;
}
declare class Collection<T> {
    private items;
    add(item: T): void;
    getItems(): T[];
}
declare const collection: Collection<Book>;
declare const collection2: Collection<Game>;
//# sourceMappingURL=demo.d.ts.map