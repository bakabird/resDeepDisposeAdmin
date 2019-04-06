function isOneOf(itm, arr) {
for (let i = 0; i < arr.length; i++) {
    if (itm === arr[i]) {
    return true
    }
}
return false
}
function sortIndex(a, b) {
return b.index - a.index
}
function sortRaw(a, b) {
return a.isRaw - b.isRaw
}


export default {
    isOneOf,sortIndex,sortRaw
}