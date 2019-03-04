exports.diff = (a, b) => {
  let u = a.slice(); // dup the array
  b.map(e => {
    if (u.indexOf(e) > -1) delete u[u.indexOf(e)]
    else u.push(e)   // add non existing item to temp array
  })
  return u.filter((x) => {return (x != null)})[0] // flatten result
}