pragma solidity ^0.4.18;

contract DocumentRegistry {
  struct Document {
    string hash;
    uint256 dateAdded;
  }
  
  struct Student {
    string name;
    string id;
    string activity;
    string role;
    uint256 date;
  }
  
  Document[] private documents;
  Student[] private students;
  address contractOwner;
  
  modifier onlyOwner() {
    require(contractOwner == msg.sender);
    _;
  }
  
  function DocumentRegistry() public {
    contractOwner = msg.sender;
  }
  
  function add(string hash) public onlyOwner returns (uint dateAdded) {
    dateAdded = block.timestamp;
    documents.push(Document(hash, dateAdded));
  }
  
  function getDocumentsCount() public view returns (uint length) {
    length = documents.length;
  }
  
  function getDocument(uint index) public view returns (string, uint) {
    Document memory document = documents[index];
    return (document.hash, document.dateAdded);
  }
  
  function createRecord(string name, string id, string activity, string role) public onlyOwner {
    uint date = block.timestamp;
    students.push(Student(name,id,activity,role,date));
  }
  
  function getStudentsCount() public view returns (uint length) {
    length = students.length;
  }
  
  function getStudent(uint index) public view returns (string, string, string, string, uint) {
    if ((index >= 0) && (index < students.length)) {
      Student memory student = students[index];
      return (student.name, student.id, student.activity, student.role, student.date);
    }
    else {
      return ("Array index out of range"," "," ", " ", 0);
    }
  }
}