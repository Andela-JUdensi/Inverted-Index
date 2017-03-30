'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

iDexApp.controller('iicontroller', ['$scope', '$localStorage', 'toastr', 'Utility', function ($scope, $localStorage, toastr, Utility) {
  var iDex = new InvertedIndex();

  $scope.bookTitles = [];
  $scope.iiScopeHolder = {};
  $scope.numberOfDocuments = iDex.numberOfDocuments;
  $scope.books = iDex.unIndexedBooks;
  $scope.showIndexes = false;
  $scope.showSearches = false;

  $scope.toggleSort = function () {
    $scope.showIndexes = false;
    $scope.iiScopeHolder = Utility.toggleSort($scope.iiScopeHolder);
    $scope.showIndexes = true;
    Utility.toggleSortInnerText('toggele-sortB', 'toggele-sort');
  };

  $scope.doUpload = function (books, booksLength, formField) {
    var _loop = function _loop(booksIndex) {
      var bookNameWithoutExtension = books[booksIndex].name.split('.')[0].toLowerCase();
      if (books[booksIndex].name.split('.').pop() !== 'json') {
        // eslint-disable-next-line no-param-reassign
        formField.value = '';
        return {
          v: Utility.feedback('Invalid file type. Only a .JSON file is allowed')
        };
      }
      if ($scope.bookTitles.includes(bookNameWithoutExtension)) {
        return {
          v: toastr.warning('File has already been uploaded', 'Already uploaded')
        };
      }

      $scope.readFile(books[booksIndex]).then(function (result) {
        Object.keys(result).map(function (bookname) {
          iDex.unIndexedBooks[bookname] = result[bookname];
          if (books[booksIndex]) {
            $scope.$apply(function () {
              $scope.bookTitles.push(bookNameWithoutExtension);
            });
            toastr.success(bookname + ' upload is successful');
            document.getElementById('create-index').innerText = 'Ready to create an iDex';
          }
        });
      }).catch(function (error) {
        // eslint-disable-next-line no-param-reassign
        formField.value = '';
        return Utility.feedback(error);
      });
    };

    /**
     * TODO: Replace for loop with a es6 like syntax
     */
    for (var booksIndex = 0; booksIndex < booksLength; booksIndex += 1) {
      var _ret = _loop(booksIndex);

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  };

  $scope.readFile = function (book) {
    return new Promise(function (resolve, reject) {
      if (window.FileReader) {
        var bookReader = new FileReader();
        bookReader.onload = function () {
          return function (readerObj) {
            try {
              var bookname = book.name;
              var allBooks = iDex.readFile(readerObj.target.result);
              iDex.validateFile(allBooks, bookname).then(function (bookHolder) {
                return resolve(bookHolder);
              }).catch(function (error) {
                return reject('This is not a valid json file\n Please get one with a vaild title and text properties');
              });
            } catch (error) {
              reject(book.name + ' is not a valid .json file.\n          Use a .json file with a "title" and "text" properties\n          Upload cancelled');
            }
          };
        }(book);
        bookReader.readAsText(book);
      } else {
        reject('The FileReader API is not supported in this browser. \nUpdate your browser');
      }
    });
  };

  $scope.buildIndex = function () {
    if ($scope.selectedBook === undefined) return Utility.feedback('Please select a book to index');

    $scope.showIndexes = true;
    $scope.showSearches = false;

    var uploadedBookName = $scope.selectedBook;

    if (uploadedBookName === 'allBooks') {
      // TODO: Build index for multiple books
      Utility.feedback('Unsupported.\n You can\'t create index for multiple files at the moment.');
      toastr.warning('That feature is not yet implemented.', 'Unsupported');
      $scope.showIndexes = false;
    } else if (Object.keys(iDex.iDexMapper).indexOf(uploadedBookName) > -1) {
      $scope.iiScopeHolder = iDex.getIndex(uploadedBookName);
      $scope.numberOfDocuments[uploadedBookName] = iDex.numberOfDocuments[uploadedBookName];
      Utility.toggleSortInnerText('toggele-sort', 'toggele-sortB');
    } else {
      var book = $scope.books[uploadedBookName];
      $scope.numberOfDocuments[uploadedBookName] = [];
      iDex.createIndex(uploadedBookName, book).then(function (result) {
        return result;
      });
      $scope.iiScopeHolder = iDex.getIndex(uploadedBookName);
      $scope.numberOfDocuments[uploadedBookName] = iDex.numberOfDocuments[uploadedBookName];
      Utility.newlyCreatedIndexInnerText();
    }
  };

  $scope.doSearch = function () {
    if (!$scope.bookToSearch) return iDex.feedback('Select an indexed book before search');
    var searchToken = $scope.searchToken;
    var searchTokens = iDex.tokenize(searchToken);
    var bookToSearch = $scope.bookToSearch;

    $scope.showSearches = true;
    $scope.showIndexes = false;
    $scope.searchResult = iDex.searchIndex(bookToSearch, searchTokens);
  };

  $scope.clickSearch = function () {
    if (!$scope.searchToken) return Utility.feedback('A word must be entered to search');
    $scope.doSearch();
  };

  $scope.doLiveSearch = function () {
    if ($scope.searchToken.length > 3 && $scope.liveSearch === true) {
      $scope.doSearch();
    } else {
      $scope.searchResult = [];
    }
  };

  $scope.createIndexButtonText = function () {
    var uploadedBookName = $scope.selectedBook;
    if (Object.keys(iDex.iDexMapper).indexOf(uploadedBookName) !== -1) {
      document.getElementById('create-index').innerText = 'Already indexed';
    } else {
      document.getElementById('create-index').innerText = 'Get indexes';
      $scope.showIndexes = false;
    }
    $scope.iiScopeHolder = iDex.getIndex(uploadedBookName);
  };

  $scope.searchIndexButtonText = function () {
    $scope.showIndexes = false;
    var bookName = $scope.bookToSearch;
    document.getElementById('search-idex').innerText = 'Search ' + bookName;
  };

  $scope.saveAllData = function () {
    if (Object.keys(iDex.iDexMapper).length < 1) {
      Utility.feedback('Please index a book before trying to save');
      toastr.error('Please index a book before trying to save', 'Error');
      return;
    }
    $localStorage.savedBooks = {};
    $localStorage.numberOfDocuments = {};
    $localStorage.savedBooks = iDex.iDexMapper;
    $localStorage.numberOfDocuments = iDex.numberOfDocuments;
    toastr.success('All data have been saved to local storage.', 'Success');
  };

  $scope.loadAllData = function () {
    if (!$localStorage.savedBooks || Object.keys($localStorage.savedBooks).length < 1) {
      toastr.error('Sorry bro, no data has been saved.', 'Error');
    } else if (Object.keys(iDex.iDexMapper).length > 0) {
      toastr.warning('All data have been loaded to workspace.', 'Warning');
    } else {
      iDex.iDexMapper = $localStorage.savedBooks;
      iDex.numberOfDocuments = $localStorage.numberOfDocuments;
      $scope.numberOfDocuments = iDex.numberOfDocuments;
      $scope.books = iDex.iDexMapper;

      Object.keys(iDex.iDexMapper).map(function (bookname) {
        $scope.bookTitles.push(bookname);
      });
      toastr.success('All data have been loaded to workspace.', 'Success');
    }
  };

  $scope.deleteAllData = function () {
    if (!$localStorage.savedBooks || Object.keys($localStorage.savedBooks).length < 1) {
      toastr.error('Sorry bro, no data has been saved.', 'Error');
    } else {
      $localStorage.savedBooks = {};
      iDex.iDexMapper = {};
      $localStorage.numberOfDocuments = {};
      iDex.numberOfDocuments = {};
      $scope.books = {};
      toastr.warning('All data have been deleted from local storage.', 'Warning');
    }
  };
}]);

document.addEventListener('DOMContentLoaded', function () {
  var bookUploader = document.getElementById('book-uploader');
  bookUploader.addEventListener('change', function () {
    var books = bookUploader.files;
    var booksLength = books.length;
    angular.element(document.getElementById('book-uploader')).scope().doUpload(books, booksLength, bookUploader);
  }, false);
});