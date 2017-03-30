'use strict';

angular.module('iDexApp').factory('Utility', [function () {
  function toggleSort(createdIndex) {
    var allwords = [];
    var resultObject = {};
    Object.keys(createdIndex).map(function (word) {
      allwords.push(word);
    });
    allwords.sort();
    allwords.map(function (word) {
      resultObject[word] = '' + createdIndex[word];
    });
    return resultObject;
  }

  function toggleSortInnerText(buttonToShow, buttonToHide) {
    document.getElementById(buttonToShow).style.display = 'inline';
    document.getElementById(buttonToShow).innerText = 'Toggle sort indexes';
    document.getElementById(buttonToHide).style.display = 'none';
  }

  function newlyCreatedIndexInnerText() {
    toggleSortInnerText('toggele-sort', 'toggele-sortB');
    document.getElementById('create-index').innerText = 'Indexes created';
  }

  function feedback(message) {
    document.getElementById('modal-body').innerText = message;
    $('#iDexModal').modal();
  }

  return {
    toggleSort: toggleSort,
    toggleSortInnerText: toggleSortInnerText,
    newlyCreatedIndexInnerText: newlyCreatedIndexInnerText,
    feedback: feedback
  };
}]);