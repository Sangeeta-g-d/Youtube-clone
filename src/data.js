export const API_KEY = 'AIzaSyCtgUA5ZI2nv_-7BKIHJOkzU4z8aH7azng';

export const value_converter = (value) =>{
    if(value >= 1000000){
        return Math.floor(value/1000000)+"M";
    }
    else if (value >= 1000){
        return Math.floor(value/1000)+"K";
    }
    else{
        return value;
    }
}