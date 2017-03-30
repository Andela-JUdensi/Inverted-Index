# Inverted-Index
[![Build Status](https://travis-ci.org/Andela-JUdensi/inverted-index.svg?branch=master)](https://travis-ci.org/Andela-JUdensi/inverted-index) [![Code Climate](https://codeclimate.com/repos/58d562d087cac70272000420/badges/c4e5859a9b1e29fac091/gpa.svg)](https://codeclimate.com/repos/58d562d087cac70272000420/feed) [![Issue Count](https://codeclimate.com/repos/58d562d087cac70272000420/badges/c4e5859a9b1e29fac091/issue_count.svg)](https://codeclimate.com/repos/58d562d087cac70272000420/feed) [![CircleCI](https://circleci.com/gh/Andela-JUdensi/inverted-index/tree/master.svg?style=svg)](https://circleci.com/gh/Andela-JUdensi/inverted-index/tree/master) [![Coverage Status](https://coveralls.io/repos/github/Andela-JUdensi/inverted-index/badge.svg?branch=develop)](https://coveralls.io/github/Andela-JUdensi/inverted-index?branch=develop) [![Silicon Valley](https://img.shields.io/badge/SiliconValley-100-blue.svg)](https://img.shields.io/badge/SiliconValley-100-blue.svg) [![Deploy](https://www.herokucdn.com/deploy/button.svg)](http://idexii-staging.herokuapp.com/)

# What is iDex?
iDex is a web implemtation of **Inverted Index**
### What is Inverted index?
> In computer science, an inverted index (also referred to as postings file or inverted file) is an index data structure storing a mapping from content, such as words or numbers, to its locations in a database file, or in a document or a set of documents (named in contrast to a Forward Index, which maps from documents to content). The purpose of an inverted index is to allow fast full text searches, at a cost of increased processing when a document is added to the database.
> - Wikipedia (https://en.wikipedia.org/wiki/Inverted_index)

### Why is the project useful?
The inverted index data structure is a central component of a typical search engine indexing algorithm. A goal of a search engine implementation is to optimize the speed of the query: find the documents where word X occurs. Once a forward index is developed, which stores lists of words per document, it is next inverted to develop an inverted index. Querying the forward index would require sequential iteration through each document and to each word to verify a matching document. The time, memory, and processing resources to perform such a query are not always technically realistic. Instead of listing the words per document in the forward index, the inverted index data structure is developed which lists the documents per word.
With the inverted index created, the query can now be resolved by jumping to the word ID (via random access) in the inverted index.

# Getting started

### Requirements
1. A web browser to run application.
2. A Json file with a title and text properties of this format:

```javascript
[
  {
    "title": "How to Read a book",
    "text": "Men are rational animals. Their rationality agreement is the source of their power to agree. "
  },

  {
    "title": "The Naked Ape.",
    "text": "Indeed, we have the most subtle and complex facial expression system of all living animals."
  }
]
```

###### For Developers
1. On a local environment, Node.js is required

### How to setup/installation/configuration
View the online version [![Deploy](https://www.herokucdn.com/deploy/button.svg)](http://idexii-staging.herokuapp.com/)

**To run on a local environment**
##### How to run test

Clone or download and unzip this repository into a local directory: git clone https://github.com/Andela-JUdensi/inverted-index.git

On the terminal, change to the containing directory, and run the following commands:

**To install dependencies**
```javascript
$ npm install
```
**To run application**
```javascript
$ gulp
```
or
```javascript
$ npm start
```
**To run unit test**
```javascript
$ npm test
```
or
```javascript
$ gulp test
```
**To run test coverage**

to view coverage result in the terminal
```javascript
$ gulp coverage
```

to generate the coverage in a .html 
```javascript
$ npm run coverage
```

### Limitations of project
1. Only .json files can be indexed
2. Runs only on the web browser
3. 

### Contributing to the project
Fork this repositry to your account.
Clone your repositry: git clone git@github.com:your-username/inverted-index.git
Create your feature branch: git checkout -b new-feature
Commit your changes: git commit -m "did something"
Push to the remote branch: git push origin new-feature
Open a pull request.

### Troubleshooting and FAQ

### License
MIT [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Andela-JUdensi/inverted-index)

### Technologies
EcmaScript 6 (JavaScript 2015)
Node.js
Express.js (Creates server)
Angular.js (Frontend )
Gulp (Task Runner)
Karma (Generates Test Coverage Folder)
Babel (Transpiles from EcmaScript 6 to Ecmascript 5 for browser compatibility)
Uglify (Generates minified/compressed versions)
Jasmine (Unit test runner)

### Contributions
**Contributions are welcome.** [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Andela-JUdensi/inverted-index/issues)
1. Fork this repositry.
2. Clone to you local environment: git clone git@github.com:your-username/inverted-index.git
3. Create a branch on a feature you want to work on: git checkout -b proposed-feature
4. Commit your changes: git commit -m "new stuff added"
5. Push to the remote branch: git push origin proposed-feature
6. Open a pull request on here
