// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SchoolManagement {
    address public admin;

    struct Student {
        string name;
        bool isRegistered;
        uint256 registrationDate;
    }

    mapping(uint256 => Student) public students;
    uint256 public totalStudents;

    event StudentRegistered(uint256 studentId, string name);
    event StudentRemoved(uint256 studentId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerStudent(uint256 _studentId, string memory _name) public onlyAdmin {
        require(_studentId > 0, "Invalid student ID");
        require(!students[_studentId].isRegistered, "Student already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");

        students[_studentId] = Student(_name, true, block.timestamp);
        totalStudents++;

        emit StudentRegistered(_studentId, _name);
    }

    function removeStudent(uint256 _studentId) public onlyAdmin {
        require(students[_studentId].isRegistered, "Student not found");

        students[_studentId].isRegistered = false;
        totalStudents--;

        emit StudentRemoved(_studentId);
    }

    function getStudent(uint256 _studentId) public view returns (string memory, bool, uint256) {
        require(students[_studentId].isRegistered, "Student not found");

        Student memory student = students[_studentId];
        return (student.name, student.isRegistered, student.registrationDate);
    }
}
