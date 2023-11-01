const currentPath = window.location.pathname;
const gdrPaths = ["/gdr/f", "/gdr/m", "/gdr/o"];
const locPaths = ["/loc/enc", "/loc/esc", "/loc/ma", "/loc/mt", "/loc/ne", "/loc/pac", "/loc/sa", "/loc/wnc", "/loc/wsc", "/loc/p"];
const relPaths = ["/rel/sc", "/rel/dp", "/rel/mm", "/rel/dv", "/rel/sp", "/rel/wd"];

let parts = currentPath.split('/');
let route = parts[1];
let index;
let prevIndex;
let nextIndex;
let pathLength;
let nextPath;
let prevPath;

if (route === "gdr") {
    // Get the index of the current path and the length of the current path
    index = gdrPaths.indexOf(currentPath);
    pathLength = gdrPaths.length;

    // Calculate the next and previous indexes
    prevIndex = (index - 1 + pathLength) % pathLength;
    nextIndex = (index + 1) % pathLength;

    // Set the next and previous paths
    prevPath = gdrPaths[prevIndex];
    nextPath = gdrPaths[nextIndex];
} else if (route === "loc") {
    // Get the index of the current path and the length of the current path
    index = locPaths.indexOf(currentPath);
    pathLength = locPaths.length;

    // Calculate the next and previous indexes
    prevIndex = (index - 1 + pathLength) % pathLength;
    nextIndex = (index + 1) % pathLength;

    // Set the next and previous paths
    prevPath = locPaths[prevIndex];
    nextPath = locPaths[nextIndex];
} else if (route === "rel") {
    // Get the index of the current path and the length of the current path
    index = relPaths.indexOf(currentPath);
    pathLength = relPaths.length;

    // Calculate the next and previous indexes
    prevIndex = (index - 1 + pathLength) % pathLength;
    nextIndex = (index + 1) % pathLength;

    // Set the next and previous paths
    prevPath = relPaths[prevIndex];
    nextPath = relPaths[nextIndex];
}

console.log(prevPath);
console.log(nextPath);

document.getElementById("previous").href = prevPath;
document.getElementById("next").href = nextPath;