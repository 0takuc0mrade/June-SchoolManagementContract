import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { abi } from './abi.json';

const contractAddress = 'YOUR_SMART_CONTRACT_ADDRESS';
const contractABI = abi;

export default function SchoolDApp() {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setContract(new ethers.Contract(contractAddress, contractABI, signer));
    }
  }, []);

  const registerStudent = async () => {
    if (contract && studentId && studentName) {
      await contract.registerStudent(studentId, studentName);
      alert('Student registered');
    }
  };

  const getStudent = async () => {
    if (contract && studentId) {
      const student = await contract.getStudent(studentId);
      setStudentInfo({
        name: student[0],
        isRegistered: student[1] ? 'Yes' : 'No',
        registrationDate: new Date(student[2] * 1000).toLocaleString(),
      });
    }
  };

  const removeStudent = async () => {
    if (contract && studentId) {
      await contract.removeStudent(studentId);
      alert('Student removed');
      setStudentInfo(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold">School DApp</h1>
      <input
        type="text"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="border p-1 m-1"
      />
      <input
        type="text"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="border p-1 m-1"
      />
      <button
        onClick={registerStudent}
        className="bg-blue-500 text-white p-1 m-1"
      >
        Register
      </button>
      <button onClick={getStudent} className="bg-green-500 text-white p-1 m-1">
        Get Info
      </button>
      <button onClick={removeStudent} className="bg-red-500 text-white p-1 m-1">
        Remove
      </button>
      {studentInfo && (
        <div className="mt-2 border p-2">
          <p>Name: {studentInfo.name}</p>
          <p>Registered: {studentInfo.isRegistered}</p>
          <p>Date: {studentInfo.registrationDate}</p>
        </div>
      )}
    </div>
  );
}
