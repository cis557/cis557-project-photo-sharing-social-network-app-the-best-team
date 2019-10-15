/* global document fetch */

// Constructs the starting document.
function constructDocument() {
  const outerContainer = document.createElement('div');
  outerContainer.setAttribute('id', 'outerContainer');
  document.body.appendChild(outerContainer);

  const innerContainer = document.createElement('div');
  innerContainer.setAttribute('id', 'innerContainer');
  outerContainer.appendChild(innerContainer);
}

module.exports = {
  constructDocument,
};
