// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string cid;
        string name;
        address uploader;
        uint256 timestamp;
    }

    mapping(address => File[]) public userFiles;

    event FileUploaded(address indexed uploader, string cid, string name, uint256 timestamp);

    function uploadFile(string memory _cid, string memory _name) public {
        File memory newFile = File(_cid, _name, msg.sender, block.timestamp);
        userFiles[msg.sender].push(newFile);
        emit FileUploaded(msg.sender, _cid, _name, block.timestamp);
    }

    function getUserFiles(address _user) public view returns (File[] memory) {
        return userFiles[_user];
    }
}