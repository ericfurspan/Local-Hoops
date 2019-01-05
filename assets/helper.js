// helper.js - helper functions


//sort array by date descending
export let sortByDateDesc = (a,b) => {
    let c = new Date(a.time);
    let d = new Date(b.time);
    return d-c;
}
