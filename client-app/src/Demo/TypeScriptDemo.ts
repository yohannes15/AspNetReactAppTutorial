// OBJECTS ARE BETTER HAVING INTERFACES
export interface ICar {
    color: string;
    model: string;
    topSpeed?: number;
}

const car1: ICar = {
    color: 'blue',
    model: 'BMW'
}

const car2: ICar = {
    color: 'red',
    model: 'Mercedes',
    topSpeed : 100
}

//---------------------------------------
// Arguments can't have any type implicity. Needs to be explicit because of strict.
const multiply = (x: number,y: number) : string => {
    return (x*y).toString();
}

// Added export for usage in react
export const cars = [car1, car2]
