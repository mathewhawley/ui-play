const ancestorWithClass = (element, classname) => {
  // If the current element has the specified class, return the element
  if (element.className && element.className.split(' ').includes(classname)) {
    return element;
  }
  // Check ancestor nodes until no more
  return element.parentNode && ancestorWithClass(element.parentNode, classname);
};
